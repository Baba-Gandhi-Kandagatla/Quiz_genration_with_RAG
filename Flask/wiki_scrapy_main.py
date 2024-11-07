from multiprocessing import Process, Queue
from scrapy.crawler import CrawlerProcess
from scrapy import signals
from scrapy.signalmanager import dispatcher
import scrapy
from googlesearch import search
import json
import os

class KnowledgeSpider(scrapy.Spider):
    name = 'knowledge'
    
    def __init__(self, topic=None, *args, **kwargs):
        super(KnowledgeSpider, self).__init__(*args, **kwargs)
        self.topic = topic
        self.result = {}

    def start_requests(self):
        url = self.topic
        yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        if response.status == 200:
            title = response.xpath('//h1/text()').get() or response.xpath('//title/text()').get()
            paragraphs = response.xpath('//p//text()').getall()
            content = ''.join(paragraphs).strip()
            self.result = {
                'topic': "",
                'title': title,
                'content': content,  # Only store the first 500 characters
                'url': self.topic
            }
        else:
            self.result = {'error': 'Page not found', 'topic': self.topic}

def find_reliable_link(topic):
    reliable_sites = ["wikipedia.org", "britannica.com", "plato.stanford.edu"]
    for site in reliable_sites:
        search_query = f'{topic} site:{site}'
        for url in search(search_query, num_results=5):
            if site in url:
                return url
    return None

def run_scrapy_in_process(knowledge_url, result_queue):
    result = {}
    
    def crawler_result(signal, sender, spider):
        nonlocal result
        result = spider.result  # Get the result from the spider instance

    # Connect the signals to capture the result
    dispatcher.connect(crawler_result, signal=signals.spider_closed)
    
    process = CrawlerProcess()
    
    # Start the crawl process using the spider class and the topic argument
    process.crawl(KnowledgeSpider, topic=knowledge_url)
    process.start()  # This will block until the crawling is finished
    
    result_queue.put(result)

def load_existing_data(filename="scraped_results.json"):
    """Load existing data from the JSON file if it exists and is valid."""
    if os.path.exists(filename):
        # Ensure that the file is not empty before trying to read it
        if os.path.getsize(filename) > 0:
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    return json.load(f)  # Load the existing JSON data
            except json.JSONDecodeError:
                # If the file exists but contains invalid JSON, reinitialize it
                print(f"{filename} contains invalid JSON. Reinitializing.")
                return []
        else:
            # File exists but is empty
            print(f"{filename} is empty. Initializing a new list.")
            return []
    else:
        # File doesn't exist
        print(f"{filename} does not exist. Initializing a new list.")
        return []

def save_to_json(data, filename="scraped_results.json"):
    """Save data to a single JSON file."""
    existing_data = load_existing_data(filename)
    
    # Append the new result to the list
    existing_data.append(data)
    
    # Write back to the file with the updated data
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)
    print(f"Data saved to {filename}")

def check_if_topic_exists(topic, filename="scraped_results.json"):
    """Check if the topic already exists in the JSON file."""
    existing_data = load_existing_data(filename)
    for entry in existing_data:
        if entry.get('topic') == topic:
            return entry  # Return the entry if found
    return None

def is_json_file_empty(filename):
    """Check if a JSON file is empty or contains no valid data."""
    if os.path.exists(filename) and os.path.getsize(filename) > 0:
        with open(filename, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                if not data:  # Empty JSON data (empty list or dict)
                    return True
                return False
            except json.JSONDecodeError:
                return True  # Corrupted or invalid JSON
    return True  # File doesn't exist or is zero-sized

def get_info(topic):
    filename = "scraped_results.json"
    
    # Check if the JSON file is empty
    if is_json_file_empty(filename):
        print(f"{filename} is empty. Proceeding with scraping.")
    else:
        # Check if the topic is already stored in the JSON file
        existing_entry = check_if_topic_exists(topic, filename)
        if existing_entry:
            print(f"Returning existing content for '{topic}' from the JSON file.")
            return existing_entry['content']
    
    # Find the link for the topic
    knowledge_url = find_reliable_link(topic)
    if knowledge_url is None:
        print("Relevant page not found.")
        return None
    
    result_queue = Queue()
    p = Process(target=run_scrapy_in_process, args=(knowledge_url, result_queue))
    p.start()
    p.join()
    answer = result_queue.get()
    
    if 'error' in answer:
        print(f"Error: {answer['error']}")
        return None
    elif 'title' in answer:
        print(f"Title: {answer['title']}")
        answer['topic'] = topic

        # Save the result along with the topic name to the JSON file
        save_to_json(answer, filename)
        
        # Return the content
        return answer['content']
    else:
        print(f"Scraping finished, but no title found: {answer}")
        return None

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        topic = sys.argv[1]
        content = get_info(topic)
        if content:
            print(f"Content for '{topic}':\n{content}")
        else:
            print("No content found.")
    else:
        print("Please provide a topic.")