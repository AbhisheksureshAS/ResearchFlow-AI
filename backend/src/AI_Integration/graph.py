from langgraph.graph import StateGraph,START,END
from langgraph.checkpoint.postgres import PostgresSaver
from backend.src.utils.setting import setting
from backend.src.AI_Integration.state import ResearchState
from backend.src.AI_Integration import nodes

# checkpoint=PostgresSaver.from_conn_string(setting.DB_CONNECTION)
# checkpoint.setup()

graph=StateGraph(ResearchState)
graph.add_node('research',nodes.research_node)
graph.add_node('writer',nodes.writer_node)
graph.add_node('editor',nodes.editor_node)
graph.add_node('human',nodes.human_review_node)
graph.add_node('revision_limit',nodes.revision_limit_node)

graph.add_edge(START,'research')
graph.add_edge('research','human')
graph.add_edge('writer','human')
graph.add_edge('editor','human')
graph.add_conditional_edges('human',nodes.route_after_review)

def get_graph(checkpoint):
    return graph.compile(checkpoint)

