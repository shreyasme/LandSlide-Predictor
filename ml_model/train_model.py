import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score, classification_report
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
import joblib
import os

# Set random seed for reproducibility
np.random.seed(42)

class LandslidePredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.soil_type_encoder = LabelEncoder()
        self.feature_names = ['rainfall', 'humidity', 'soil_moisture', 'slope_angle', 
                             'soil_type_encoded', 'temperature', 'earthquake_intensity', 
                             'elevation', 'vegetation_density', 'water_level']

    def load_data(self, filepath):
        """Load dataset from CSV"""
        df = pd.read_csv(filepath)
        print(f"Dataset loaded: {df.shape[0]} records, {df.shape[1]} features")
        return df

    def preprocess_data(self, df):
        """Preprocess and handle missing values"""
        # Handle missing values
        df = df.fillna(df.mean(numeric_only=True))
        
        # Encode soil_type
        if 'soil_type' in df.columns:
            df['soil_type_encoded'] = self.soil_type_encoder.fit_transform(df['soil_type'])
        
        print("Data preprocessing completed")
        return df

    def prepare_features(self, df):
        """Prepare features for training"""
        X = df[['rainfall', 'humidity', 'soil_moisture', 'slope_angle', 'soil_type_encoded',
                'temperature', 'earthquake_intensity', 'elevation', 'vegetation_density', 'water_level']]
        y = df['risk_level'] if 'risk_level' in df.columns else None
        
        # Encode target variable
        if y is not None:
            self.risk_encoder = LabelEncoder()
            y = self.risk_encoder.fit_transform(y)
        
        return X, y

    def train(self, X_train, y_train):
        """Train Random Forest model"""
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_train_scaled, y_train)
        print("Model training completed")

    def evaluate(self, X_test, y_test):
        """Evaluate model performance"""
        X_test_scaled = self.scaler.transform(X_test)
        y_pred = self.model.predict(X_test_scaled)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted')
        recall = recall_score(y_test, y_pred, average='weighted')
        f1 = f1_score(y_test, y_pred, average='weighted')
        
        print("\n=== Model Evaluation ===")
        print(f"Accuracy:  {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall:    {recall:.4f}")
        print(f"F1 Score:  {f1:.4f}")
        
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=self.risk_encoder.classes_))
        
        cm = confusion_matrix(y_test, y_pred)
        return accuracy, cm, y_pred

    def plot_confusion_matrix(self, cm, y_test, y_pred):
        """Plot confusion matrix"""
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=self.risk_encoder.classes_,
                   yticklabels=self.risk_encoder.classes_)
        plt.title('Confusion Matrix - Landslide Risk Prediction')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        plt.savefig('models/confusion_matrix.png', dpi=100)
        print("Confusion matrix saved to models/confusion_matrix.png")

    def plot_feature_importance(self):
        """Plot feature importance"""
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        plt.figure(figsize=(10, 6))
        plt.barh(feature_importance['feature'], feature_importance['importance'])
        plt.xlabel('Importance')
        plt.title('Feature Importance - Landslide Risk Prediction')
        plt.tight_layout()
        plt.savefig('models/feature_importance.png', dpi=100)
        print("Feature importance plot saved to models/feature_importance.png")
        print("\nFeature Importance:")
        print(feature_importance)

    def save_model(self, filepath='models/landslide_model.pkl'):
        """Save trained model"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self.model, filepath)
        joblib.dump(self.scaler, filepath.replace('.pkl', '_scaler.pkl'))
        joblib.dump(self.soil_type_encoder, filepath.replace('.pkl', '_soil_encoder.pkl'))
        joblib.dump(self.risk_encoder, filepath.replace('.pkl', '_risk_encoder.pkl'))
        print(f"Model saved to {filepath}")

    def load_model(self, filepath='models/landslide_model.pkl'):
        """Load trained model"""
        self.model = joblib.load(filepath)
        self.scaler = joblib.load(filepath.replace('.pkl', '_scaler.pkl'))
        self.soil_type_encoder = joblib.load(filepath.replace('.pkl', '_soil_encoder.pkl'))
        self.risk_encoder = joblib.load(filepath.replace('.pkl', '_risk_encoder.pkl'))
        print(f"Model loaded from {filepath}")

    def predict(self, features):
        """Make prediction on new data"""
        features_scaled = self.scaler.transform([features])
        prediction = self.model.predict(features_scaled)[0]
        probability = self.model.predict_proba(features_scaled)[0].max()
        risk_level = self.risk_encoder.inverse_transform([prediction])[0]
        return risk_level, probability

def main():
    print("="*60)
    print("Landslide Risk Prediction - Model Training")
    print("="*60)
    
    # Initialize predictor
    predictor = LandslidePredictor()
    
    # Load data
    df = predictor.load_data('data/landslide_dataset.csv')
    
    # Preprocess
    df = predictor.preprocess_data(df)
    
    # Prepare features
    X, y = predictor.prepare_features(df)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    # Train model
    predictor.train(X_train, y_train)
    
    # Evaluate
    accuracy, cm, y_pred = predictor.evaluate(X_test, y_test)
    
    # Plot results
    predictor.plot_confusion_matrix(cm, y_test, y_pred)
    predictor.plot_feature_importance()
    
    # Save model
    predictor.save_model()
    
    print("\n" + "="*60)
    print("Training completed successfully!")
    print("="*60)

if __name__ == "__main__":
    main()
