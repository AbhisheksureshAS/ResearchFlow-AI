import requests
from langchain.agents import create_agent
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.tools import tool
from dotenv import load_dotenv
from backend.src.AI_Integration.system_prompt import researcher_system_prompt,writer_system_prompt,editor_system_prompt
from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain_ollama import ChatOllama
from langchain_meta import ChatMetaModel
import os
from langchain_google_genai import ChatGoogleGenerativeAI
load_dotenv()

llm=ChatGoogleGenerativeAI(model='gemini-3.8-flash')

# llm=ChatOllama(
#     model='gemma3:4b'
# )
# llm=ChatGroq(
#     model='whisper-large-v3',
# )
# llm=ChatMetaModel(model='muse-spark-1.1',api_key=os.getenv('MODEL_API_KEY'))

search=GoogleSerperAPIWrapper()
@tool
def search_engine(query:str):
    '''
    this is a search engine tool.
    it is used for getting the information from
    the web and internet.
    this tool is only used when llm or the model has not the sufficient datat
    Args:
        query: this query will be send by llm model
    '''
    return search.run(query)

@tool
def get_blog_template(blog_type: str) -> str:
    """Get a structure for a tutorial, research article, or comparison blog."""

    templates = {
        "tutorial": """
        Introduction
        Prerequisites
        Step-by-step guide
        Examples
        Common mistakes
        Conclusion
        """,
        "listicle": """
        Introduction
        List of key points
        Explanation of each point
        Practical recommendations
        Conclusion
        """,

        "opinion": """
        Introduction and central argument
        Background and context
        Supporting arguments
        Counterarguments
        Conclusion
        """,

        "how_to": """
        Introduction
        Requirements
        Step-by-step instructions
        Troubleshooting
        Conclusion
        """,
        "research": """
        Overview
        Background
        Research findings
        Analysis
        Limitations
        Conclusion and references
        """,
        "comparison": """
        Introduction
        Options compared
        Feature comparison
        Pros and cons
        Use cases
        Conclusion
        """
    }

    return templates.get(
        blog_type.lower(),
        templates["research"]
    )

@tool
def check_source_url(url: str) -> str:
    """Check whether a source URL is reachable."""

    try:
        response = requests.get(
            url,
            timeout=5,
            allow_redirects=True
        )

        return (
            f"HTTP status: {response.status_code}\n"
            f"Final URL: {response.url}"
        )

    except requests.RequestException as exc:
        return f"Could not access URL: {exc}"


researcher_agent=create_agent(
       model=llm,
       tools=[search_engine],
        system_prompt= researcher_system_prompt
    )
writer_agent=create_agent(
       model=llm,
       tools=[get_blog_template],
        system_prompt= writer_system_prompt
    )
editor_agent=create_agent(
       model=llm,
       tools=[check_source_url],
        system_prompt= editor_system_prompt
    )


