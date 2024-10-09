
# Command: uvicorn app:app --host 0.0.0.0 --port 8000 --reload


from fastapi import FastAPI, File, UploadFile, Form
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from sentence_transformers import SentenceTransformer
import torch
import faiss
import numpy as np
from docx import Document
import time
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for security reasons
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load the text-generation model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = AutoModelForCausalLM.from_pretrained(
    "microsoft/Phi-3.5-mini-instruct",
    device_map="cuda",
    torch_dtype="auto",
    cache_dir="./micro-chat",
    trust_remote_code=True
)
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3.5-mini-instruct", cache_dir="./micro-chat-T")
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)

# Load the sentence transformer model for embedding generation
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', cache_folder="./embed-model")

# FAISS index to store embeddings for vector search
dimension = 384  # Dimensionality of the embeddings from 'all-MiniLM-L6-v2'
index = faiss.IndexFlatL2(dimension)
vector_text_mapping = []

def extract_text_from_docx(file: UploadFile):
    """Extract text from a Word document directly from memory."""
    doc = Document(file.file)
    full_text = []
    for paragraph in doc.paragraphs:
        full_text.append(paragraph.text)
    return "\n".join(full_text)

def store_text_in_vector_db(text):
    """Generate embeddings for text and store them in the vector database."""
    global index, vector_text_mapping
    sentences = text.split(".")
    embeddings = embedding_model.encode(sentences, convert_to_tensor=False)
    embeddings = np.array(embeddings)
    index.add(embeddings)
    vector_text_mapping.extend(sentences)

def retrieve_relevant_text(query, top_k=3):
    """Retrieve the most relevant text chunks based on the query."""
    global index, vector_text_mapping
    query_embedding = embedding_model.encode([query], convert_to_tensor=False)
    query_embedding = np.array(query_embedding).astype(np.float32)
    distances, indices = index.search(query_embedding, top_k)
    if len(distances[0]) == 0 or np.all(distances[0] > 1.3):  # Adjust threshold as needed
        return None  # No relevant data found

    retrieved_text = [vector_text_mapping[i] for i in indices[0]]
    return " ".join(retrieved_text)


@app.post("/generate-questions")
async def generate_questions(
    file: UploadFile = File(None),  # Word document file is optional
    topic: str = Form(None),        # Topic is optional
    question_type: str = Form("Mcqs"),
    number_questions: int = Form(6)
):
    try:
        print(file,topic,question_type,number_questions)
        document_text = ""
        
        # Check if a Word document is provided
        if file and topic:
            document_text = extract_text_from_docx(file)
            store_text_in_vector_db(document_text)
            query = f"{topic}"
            relevant_text = retrieve_relevant_text(query)
        else:
            return {"generated_questions": "Please provide both  topic and a Word document."}

        start_time = time.time()

        # Generate questions using the language model
        messages = [
            {"role": "system", "content": f"You are a helpful AI assistant who generates {number_questions} {question_type} questions from given text."},
            {"role": "user", "content": f"Using the following '{relevant_text}' , generate {number_questions} {question_type} questions on the topic '{topic}'"},
        ]
        generation_args = {
            "max_new_tokens": 1000,
            "return_full_text": False,
            "temperature": 0.0,
            "do_sample": False,
        }
        output = pipe(messages, **generation_args)

        end_time = time.time()
        elapsed_time = end_time - start_time

        if output and len(output) > 0 and 'generated_text' in output[0]:
            return {
                "generated_questions": output[0]['generated_text'],
                "time_taken": f"{elapsed_time:.2f} seconds"
            }
        else:
            return {"error": "No output generated by the model."}

    except Exception as e:
        return {"error": str(e)}
