import random
from openai import OpenAI
from supabase import create_client, Client
import os
import json
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Set OpenAI API key and Supabase credentials
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

# Create Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

# Function to fetch random authors from Supabase (from the 'authors' table)
def get_random_author():
    try:
        # Select all authors from the 'authors' table
        response = supabase.table("authors").select("*").execute()
        authors = response.data
        # Randomly select one author
        return random.choice(authors)
    except Exception as e:
        print(f"Error fetching authors: {str(e)}")
        return None

# Function to generate one fictional book with 1200-character content and publication_date
def generate_book_for_author():
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant that generates fictional book data. Generate book text content."
        },
        {
            "role": "user",
            "content": '''
            Generate a fictional book with the following fields: 
            title, content (minimum 2048 characters of the actual book text, which is part of the story), blurb (40 characters), and publication_date (between 1975 and 2023).
            The content should be a part of the book's story, not a summary or description.
            The data should be in JSON format, and all fields should be in Japanese. Field keys should be in English.
            The publication date should be later than its author's birth date.
            The title should be creative and unique.
            '''
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        max_tokens=5000,  # Ensure enough tokens for 1200+ characters
        temperature=0.7
    )

    # Try to convert the response content into a dictionary if it's valid JSON
    try:
        book_data = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        # If JSON parsing fails, return the raw response content
        book_data = response.choices[0].message.content

    return book_data


# Function to generate a random date between 1975 and 2023
def generate_random_date():
    start_date = datetime(1975, 1, 1)
    end_date = datetime(2023, 12, 31)
    random_date = start_date + (end_date - start_date) * random.random()
    return random_date.strftime("%Y-%m-%d")

# Function to insert a book into Supabase
def insert_book_to_supabase(book):
    try:
        # Insert the book data into the "books" table in Supabase
        response = supabase.table("books").insert(book).execute()
        return response.data
    except Exception as e:
        print(f"Error: {str(e)}")

# Main function
if __name__ == "__main__":
    # Fetch 1 random author from Supabase
    author = get_random_author()

    if author:
        # Generate 1 book (with actual text content) for the selected author
        book_data = generate_book_for_author()
        
        if book_data:
            try:
                # Check if the result is a string, and if so, convert it to a dictionary
                if isinstance(book_data, str):
                    book = json.loads(book_data)
                else:
                    book = book_data

                # Add author_id to the book entry (referencing 'authors' table)
                book['author_id'] = author['id']  # Map 'author_id' correctly

                # Set a random publication_date in the "YYYY-MM-DD" format
                book['publication_date'] = generate_random_date()
                
                # Insert the book into Supabase
                insert_book_to_supabase(book)
            
            except json.JSONDecodeError as e:
                print(f"Error: Failed to parse JSON. Details: {e}")
            except TypeError as te:
                print(f"Error: Type issue. Details: {te}")
