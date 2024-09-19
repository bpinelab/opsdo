from openai import OpenAI
from supabase import create_client, Client
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set OpenAI API key and Supabase credentials
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

# Create Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

# Function to generate 2 fictional Japanese authors using ChatGPT API
def generate_authors():
    messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant that generates fictional Japanese author data."
        },
        {
            "role": "user",
            "content": '''
            Generate a list of 10 fictional Japanese authors in JSON format.
            Each author should have the following fields: name, gender, age, and background.
            Age should be a number.
            Each data should be written in Japanese, however, each field key should be written in English.
            '''
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        max_tokens=1500,
        temperature=0.7
    )

    # Return the response content in JSON format
    return response.choices[0].message.content


# Function to insert authors into Supabase
def insert_authors_to_supabase(authors):
    try:
        # Insert the authors data into the "authors" table in Supabase
        response = supabase.table("authors").insert(authors).execute()
        
        # Return response data
        return response.data
    
    except Exception as e:
        print(f"Error: {str(e)}")


# Main function
if __name__ == "__main__":
    # Generate 2 fictional Japanese authors
    authors_data = generate_authors()

    if authors_data:
        try:
            # Convert the data to JSON format
            authors = json.loads(authors_data)
            
            # Insert authors into Supabase
            insert_authors_to_supabase(authors)
        
        except json.JSONDecodeError as e:
            print(f"Error: Failed to parse JSON. Details: {e}")
