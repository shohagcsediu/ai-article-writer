from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv
import uvicorn

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="AI Article Generator API",
    description="Generate articles using Google's Gemini AI",
    version="1.0.0"
)

# Configure CORS for your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure your Gemini API key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set.")

genai.configure(api_key=GOOGLE_API_KEY)

# Select the Gemini model
model = genai.GenerativeModel('gemini-2.0-flash')  # or 'gemini-pro-vision' for multimodal

# Pydantic models for request/response validation
class GenerateRequest(BaseModel):
    prompt: str
    temperature: Optional[float] = 0.9
    top_p: Optional[float] = 1.0
    top_k: Optional[int] = 1
    max_output_tokens: Optional[int] = 2048

class GenerateResponse(BaseModel):
    generated_text: str

class ArticleRequest(BaseModel):
    prompt: str

class ArticleResponse(BaseModel):
    article: str

class HealthResponse(BaseModel):
    status: str

@app.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    """
    Generates text using the Gemini API.

    Request body (JSON):
    {
        "prompt": "tell me a joke about ai",
        "temperature": 0.9, # Optional, default 0.9
        "top_p": 1, # Optional, default 1
        "top_k": 1, # Optional, default 1
        "max_output_tokens": 2048 # optional, default 2048
    }

    Response (JSON):
    {
        "generated_text": "Generated text from Gemini"
    }
    """
    try:
        if not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt is required and cannot be empty")

        response = model.generate_content(
            request.prompt,
            generation_config=genai.GenerationConfig(
                temperature=request.temperature,
                top_p=request.top_p,
                top_k=request.top_k,
                max_output_tokens=request.max_output_tokens,
            ),
        )

        return GenerateResponse(generated_text=response.text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

@app.post("/api/generate-article", response_model=ArticleResponse)
async def generate_article(request: ArticleRequest):
    """
    Generates an article using the Gemini API - specifically for the Next.js frontend.
    
    Request body (JSON):
    {
        "prompt": "Write an article about artificial intelligence"
    }

    Response (JSON):
    {
        "article": "Generated article content from Gemini"
    }
    """
    try:
        if not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt is required and cannot be empty")

        # Enhanced prompt for better article generation
        enhanced_prompt = f"""
        Write a comprehensive, well-structured article about: {request.prompt}

        Please include:
        # - An engaging introduction
        # - Clear main points with explanations
        # - Relevant examples or details
        # - A thoughtful conclusion

        Make it informative, engaging, and well-formatted with proper paragraphs.
        """

        response = model.generate_content(
            enhanced_prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.7,  # Slightly lower for more focused content
                top_p=0.95,
                top_k=40,
                max_output_tokens=3000,  # Higher limit for articles
            ),
        )

        return ArticleResponse(article=response.text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating article: {str(e)}")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Simple health check endpoint.
    """
    return HealthResponse(status="ok")

@app.get("/")
async def root():
    print('root')
    """
    Root endpoint with API information.
    """
    return {
        "message": "AI Article Generator API",
        "version": "1.0.0",
        "endpoints": {
            "generate": "/generate",
            "generate_article": "/api/generate-article",
            "health": "/health",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=port, 
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )