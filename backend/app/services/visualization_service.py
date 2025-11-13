import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from typing import Dict, Any
import numpy as np

class VisualizationService:
    """Service for creating data visualizations"""
    
    @staticmethod
    def create_scatter_plot(data: pd.DataFrame, x_col: str, y_col: str) -> str:
        """Create a scatter plot and return as base64 string"""
        plt.figure(figsize=(10, 6))
        plt.scatter(data[x_col], data[y_col], alpha=0.6, edgecolors='k')
        plt.xlabel(x_col, fontsize=12)
        plt.ylabel(y_col, fontsize=12)
        plt.title(f'{y_col} vs {x_col}', fontsize=14, fontweight='bold')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return f"data:image/png;base64,{image_base64}"
    
    @staticmethod
    def create_box_plot(data: pd.DataFrame, column: str) -> str:
        """Create a box plot and return as base64 string"""
        plt.figure(figsize=(8, 6))
        plt.boxplot(data[column].dropna(), vert=True, patch_artist=True,
                   boxprops=dict(facecolor='lightblue', alpha=0.7),
                   medianprops=dict(color='red', linewidth=2))
        plt.ylabel(column, fontsize=12)
        plt.title(f'Box Plot of {column}', fontsize=14, fontweight='bold')
        plt.grid(True, alpha=0.3, axis='y')
        plt.tight_layout()
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return f"data:image/png;base64,{image_base64}"
    
    @staticmethod
    def create_heatmap(data: pd.DataFrame) -> str:
        """Create a correlation heatmap and return as base64 string"""
        # Select only numeric columns
        numeric_data = data.select_dtypes(include=[np.number])
        
        if numeric_data.empty:
            raise ValueError("No numeric columns for heatmap")
        
        correlation_matrix = numeric_data.corr()
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', 
                   center=0, square=True, linewidths=1,
                   cbar_kws={"shrink": 0.8}, fmt='.2f')
        plt.title('Correlation Heatmap', fontsize=14, fontweight='bold')
        plt.tight_layout()
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return f"data:image/png;base64,{image_base64}"
    
    @staticmethod
    def create_histogram(data: pd.DataFrame, column: str, bins: int = 30) -> str:
        """Create a histogram and return as base64 string"""
        plt.figure(figsize=(10, 6))
        plt.hist(data[column].dropna(), bins=bins, alpha=0.7, 
                edgecolor='black', color='steelblue')
        plt.xlabel(column, fontsize=12)
        plt.ylabel('Frequency', fontsize=12)
        plt.title(f'Distribution of {column}', fontsize=14, fontweight='bold')
        plt.grid(True, alpha=0.3, axis='y')
        plt.tight_layout()
        
        # Convert to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()
        
        return f"data:image/png;base64,{image_base64}"
    
    @staticmethod
    def create_all_visualizations(data: pd.DataFrame) -> Dict[str, str]:
        """Create all visualizations and return as dict"""
        visualizations = {}
        
        # Find numeric columns
        numeric_cols = data.select_dtypes(include=[np.number]).columns.tolist()
        
        if len(numeric_cols) >= 2:
            # Assume first column is feature (e.g., Experience) and second is target (e.g., Salary)
            feature_col = numeric_cols[0]
            target_col = numeric_cols[1] if len(numeric_cols) > 1 else numeric_cols[0]
            
            # Scatter plot
            try:
                visualizations['scatter'] = VisualizationService.create_scatter_plot(
                    data, feature_col, target_col
                )
            except Exception as e:
                visualizations['scatter'] = None
            
            # Box plot for target
            try:
                visualizations['boxplot'] = VisualizationService.create_box_plot(
                    data, target_col
                )
            except Exception as e:
                visualizations['boxplot'] = None
            
            # Histogram
            try:
                visualizations['histogram'] = VisualizationService.create_histogram(
                    data, target_col
                )
            except Exception as e:
                visualizations['histogram'] = None
        
        # Heatmap
        try:
            visualizations['heatmap'] = VisualizationService.create_heatmap(data)
        except Exception as e:
            visualizations['heatmap'] = None
        
        return visualizations
