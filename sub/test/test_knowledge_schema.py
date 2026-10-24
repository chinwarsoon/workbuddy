"""Revision 0.2 | 2026-10-24 | Codex | Validate the shared schema and webpage drill-down graph."""

import copy
import json
import unittest
from pathlib import Path

from jsonschema import Draft7Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[2]
SCHEMA_PATH = ROOT / "config" / "schemas" / "knowledge_base_schema.json"


def load_json(path):
    """Load one JSON file from the repository."""
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


class KnowledgeSchemaTests(unittest.TestCase):
    """Check legacy knowledge records and the graph-ready extension."""

    @classmethod
    def setUpClass(cls):
        cls.schema = load_json(SCHEMA_PATH)
        Draft7Validator.check_schema(cls.schema)
        cls.validator = Draft7Validator(
            cls.schema,
            format_checker=FormatChecker(),
        )

    def test_eks_sample_is_valid(self):
        """Keep the approved EKS sample valid as the schema source model."""
        data = load_json(ROOT / "sub" / "ref" / "knowledge.json")
        self.assertEqual(list(self.validator.iter_errors(data)), [])

    def test_sub_dashboard_knowledge_is_valid(self):
        """Keep the current sub dashboard record valid during graph adoption."""
        data = load_json(ROOT / "sub" / "knowledge.json")
        self.assertEqual(list(self.validator.iter_errors(data)), [])

    def test_graph_nodes_edges_and_evidence_are_valid(self):
        """Accept linked dashboard entities with source evidence."""
        data = load_json(ROOT / "sub" / "knowledge.json")
        data = copy.deepcopy(data)
        source_ref = {
            "path": "sub/workplan/Sub-Dashboard-Workplan.md",
            "source_type": "workplan",
            "pointer": "#/section/4.0",
        }
        data["knowledge_graph"] = {
            "version": "1.0.0",
            "nodes": [
                {
                    "id": "workbuddy:SUB:page:dashboard",
                    "type": "webpage",
                    "name": "Submittal Dashboard",
                    "status": "planned",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:control:load",
                    "type": "control",
                    "name": "Load files control",
                    "status": "planned",
                    "attributes": {"selector": "#loadFiles"},
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:definition:load-files",
                    "type": "definition",
                    "name": "Load file definition",
                    "status": "planned",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:behavior:load-files",
                    "type": "behavior",
                    "name": "Load paired workbooks",
                    "status": "planned",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:function:read-workbooks",
                    "type": "function",
                    "name": "readWorkbook",
                    "status": "planned",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:workflow:load-data",
                    "type": "workflow",
                    "name": "Load dashboard data",
                    "status": "planned",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:dataset:workbooks",
                    "type": "dataset",
                    "name": "MDL and Submittal Log workbooks",
                    "status": "planned",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:issue:I002",
                    "type": "issue",
                    "name": "Missing shared knowledge schema",
                    "status": "resolved",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:update:U010",
                    "type": "update",
                    "name": "Knowledge schema created",
                    "status": "verified",
                    "source_refs": [source_ref],
                },
            ],
            "edges": [
                {
                    "id": "workbuddy:SUB:edge:page-contains-control",
                    "type": "contains",
                    "source_id": "workbuddy:SUB:page:dashboard",
                    "target_id": "workbuddy:SUB:control:load",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:edge:control-definition",
                    "type": "has_definition",
                    "source_id": "workbuddy:SUB:control:load",
                    "target_id": "workbuddy:SUB:definition:load-files",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:edge:control-behavior",
                    "type": "has_behavior",
                    "source_id": "workbuddy:SUB:control:load",
                    "target_id": "workbuddy:SUB:behavior:load-files",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:edge:behavior-function",
                    "type": "implemented_by",
                    "source_id": "workbuddy:SUB:behavior:load-files",
                    "target_id": "workbuddy:SUB:function:read-workbooks",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:edge:function-workflow",
                    "type": "participates_in",
                    "source_id": "workbuddy:SUB:function:read-workbooks",
                    "target_id": "workbuddy:SUB:workflow:load-data",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:edge:workflow-data",
                    "type": "reads",
                    "source_id": "workbuddy:SUB:workflow:load-data",
                    "target_id": "workbuddy:SUB:dataset:workbooks",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:edge:issue-affects-control",
                    "type": "affects",
                    "source_id": "workbuddy:SUB:issue:I002",
                    "target_id": "workbuddy:SUB:control:load",
                    "source_refs": [source_ref],
                },
                {
                    "id": "workbuddy:SUB:edge:update-resolves-issue",
                    "type": "resolves",
                    "source_id": "workbuddy:SUB:update:U010",
                    "target_id": "workbuddy:SUB:issue:I002",
                    "source_refs": [source_ref],
                }
            ],
        }
        self.assertEqual(list(self.validator.iter_errors(data)), [])

    def test_graph_edge_requires_both_endpoint_ids(self):
        """Reject an edge that has no target node identifier."""
        data = load_json(ROOT / "sub" / "knowledge.json")
        data = copy.deepcopy(data)
        data["knowledge_graph"] = {
            "version": "1.0.0",
            "nodes": [],
            "edges": [
                {
                    "id": "workbuddy:SUB:edge:invalid",
                    "type": "renders",
                    "source_id": "workbuddy:SUB:page:dashboard",
                    "source_refs": [
                        {"path": "sub/workplan/Sub-Dashboard-Workplan.md"}
                    ],
                }
            ],
        }
        self.assertTrue(list(self.validator.iter_errors(data)))


if __name__ == "__main__":
    unittest.main()
