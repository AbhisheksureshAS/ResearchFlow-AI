from backend.src.AI_Integration.state import ResearchState
from backend.src.AI_Integration import agent
from backend.src.AI_Integration.agent import writer_agent,editor_agent
from langgraph.types import interrupt
from langgraph.graph import StateGraph,START,END
def research_node(state: ResearchState):
    research_input = f"""
    Topic: {state['topic']}

    Previous research:
    {state.get('research') or 'No previous research available.'}

    Human feedback:
    {state.get('human_feedback') or 'No human feedback available.'}
    """

    response = agent.researcher_agent.invoke({
        "messages": [
            {"role": "user", "content": research_input}
        ]
    })

    return {
        "research": response["messages"][-1].content,
        "review_stage": "research",
    }

def writer_node(state: ResearchState):
    writer_input = f"""
    Topic: {state['topic']}
    Blog type: {state['blog_type']}

    Research:
    {state.get('research') or 'No research available.'}

    Previous draft:
    {state.get('draft') or 'No previous draft available.'}

    Human feedback:
    {state.get('human_feedback') or 'No human feedback available.'}
    """

    response = writer_agent.invoke({
        "messages": [
            {"role": "user", "content": writer_input}
        ]
    })

    return {
        "draft": response["messages"][-1].content,
        "review_stage": "writer",
    }


def editor_node(state: ResearchState):
    editor_input = f"""
    Topic: {state['topic']}

    Research:
    {state.get('research') or 'No research available.'}

    Draft to edit:
    {state.get('draft') or 'No draft available.'}

    Human feedback:
    {state.get('human_feedback') or 'No human feedback available.'}
    """

    response = editor_agent.invoke({
        "messages": [
            {"role": "user", "content": editor_input}
        ]
    })

    return {
        "final_blog": response["messages"][-1].content,
        "review_stage": "editor",
    }

def human_review_node(state: ResearchState):
    stage = state["review_stage"]

    if stage == "research":
        content = state.get("research")
    elif stage == "writer":
        content = state.get("draft")
    else:
        content = state.get("final_blog")

    decision = interrupt({
        "stage": stage,
        "content": content,
    })

    return {
        "approved": decision["approval"],
        "human_feedback": decision.get("feedback", ""),
        "revision_count": (
            state["revision_count"]
            if decision["approval"]
            else state["revision_count"] + 1
        ),
    }


def route_after_review(state: ResearchState):
    stage = state["review_stage"]

    if state["approved"]:
        if stage == "research":
            return "writer"
        elif stage == "writer":
            return "editor"
        return END

    if state["revision_count"] >= state["max_revisions"]:
        return "revision_limit"

    return stage

def revision_limit_node(state: ResearchState):
    return {
        "status": "revision_limit_reached"
    }