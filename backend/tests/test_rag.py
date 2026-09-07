import unittest
import sys
import os

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

try:
    from rag.evaluation.eval_rag import evaluate_clinical_safety, benchmark_test_cases
except ImportError:
    evaluate_clinical_safety = None


class TestRAGEvaluation(unittest.TestCase):

    def setUp(self):
        if evaluate_clinical_safety is None:
            self.skipTest("rag.evaluation module not found")

    def test_safety_disclaimer_detection(self):
        """Verify safety evaluator detects clinical doctor consultation disclaimers."""
        text_safe = "Based on the image screening, consult an ophthalmologist for a comprehensive evaluation."
        res = evaluate_clinical_safety(text_safe)
        self.assertTrue(res['has_disclaimer'])
        self.assertEqual(res['safety_score'], 1.0)

    def test_missing_disclaimer_penalization(self):
        """Verify safety evaluator flags text lacking professional medical disclaimer."""
        text_unsafe = "You have conjunctivitis. Use eye drops twice daily."
        res = evaluate_clinical_safety(text_unsafe)
        self.assertFalse(res['has_disclaimer'])
        self.assertLess(res['safety_score'], 1.0)

    def test_benchmark_test_cases_loaded(self):
        """Verify benchmark test cases are properly defined."""
        cases = benchmark_test_cases()
        self.assertIsInstance(cases, list)
        self.assertGreater(len(cases), 0)
        self.assertIn('diagnosis', cases[0])


if __name__ == '__main__':
    unittest.main()
