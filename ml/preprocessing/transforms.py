"""
VitalArc Preprocessing & Augmentation Pipelines
"""
import torchvision.transforms as transforms
from PIL import Image
import torch
from typing import Tuple


def get_inference_transforms(image_size: Tuple[int, int] = (224, 224)) -> transforms.Compose:
    """Returns the standardized normalization transform pipeline for model inference."""
    return transforms.Compose([
        transforms.Resize(image_size),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])


def preprocess_fundus_image(image: Image.Image, image_size: Tuple[int, int] = (224, 224)) -> torch.Tensor:
    """Preprocesses a PIL Fundus image to a normalized PyTorch tensor with batch dimension."""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    transform = get_inference_transforms(image_size)
    return transform(image).unsqueeze(0)
