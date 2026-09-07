import unittest
import sys
import os

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

try:
    from PIL import Image
except ImportError:
    Image = None

try:
    from ml.preprocessing.transforms import preprocess_fundus_image, get_inference_transforms
    import torch
except ImportError:
    preprocess_fundus_image = None
    torch = None


class TestMLTransforms(unittest.TestCase):

    def setUp(self):
        if preprocess_fundus_image is None or torch is None or Image is None:
            self.skipTest("PyTorch, PIL, or ml.preprocessing module not installed")

    def test_tensor_output_shape(self):
        """Verify image transform outputs (1, 3, 224, 224) tensor."""
        img = Image.new('RGB', (500, 300), color=(200, 100, 50))
        tensor = preprocess_fundus_image(img, image_size=(224, 224))
        self.assertEqual(tensor.shape, (1, 3, 224, 224))
        self.assertEqual(tensor.dtype, torch.float32)

    def test_grayscale_to_rgb_handling(self):
        """Verify grayscale images are converted to 3-channel RGB before tensor transform."""
        img_gray = Image.new('L', (250, 250), color=128)
        tensor = preprocess_fundus_image(img_gray, image_size=(224, 224))
        self.assertEqual(tensor.shape, (1, 3, 224, 224))


if __name__ == '__main__':
    unittest.main()
