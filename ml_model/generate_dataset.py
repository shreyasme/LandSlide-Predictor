import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

def generate_landslide_dataset(n_samples=1000):
    """Generate synthetic landslide dataset for training"""
    
    rainfall = np.random.uniform(10, 200, n_samples)  # mm
    humidity = np.random.uniform(30, 95, n_samples)  # %
    soil_moisture = np.random.uniform(20, 90, n_samples)  # %
    slope_angle = np.random.uniform(5, 80, n_samples)  # degrees
    soil_type = np.random.choice(['clay', 'sand', 'silt', 'rock'], n_samples)
    temperature = np.random.uniform(5, 40, n_samples)  # Celsius
    earthquake_intensity = np.random.uniform(0, 8, n_samples)  # Richter scale
    elevation = np.random.uniform(100, 3000, n_samples)  # meters
    vegetation_density = np.random.uniform(10, 95, n_samples)  # %
    water_level = np.random.uniform(0.5, 5, n_samples)  # meters

    # Risk level determination based on factors
    risk_scores = (
        (rainfall / 200) * 0.25 +
        (soil_moisture / 100) * 0.20 +
        (slope_angle / 80) * 0.20 +
        (1 - vegetation_density / 100) * 0.15 +
        (earthquake_intensity / 8) * 0.15 +
        (1 - humidity / 100) * 0.05
    )

    risk_level = np.where(risk_scores < 0.33, 'LOW', 
                         np.where(risk_scores < 0.67, 'MEDIUM', 'HIGH'))

    # Create DataFrame
    df = pd.DataFrame({
        'rainfall': rainfall,
        'humidity': humidity,
        'soil_moisture': soil_moisture,
        'slope_angle': slope_angle,
        'soil_type': soil_type,
        'temperature': temperature,
        'earthquake_intensity': earthquake_intensity,
        'elevation': elevation,
        'vegetation_density': vegetation_density,
        'water_level': water_level,
        'risk_level': risk_level
    })

    return df

# Generate dataset
dataset = generate_landslide_dataset(1000)

# Save to CSV
dataset.to_csv('data/landslide_dataset.csv', index=False)

print("Dataset generated successfully!")
print(f"Total records: {len(dataset)}")
print(f"\nRisk Level Distribution:")
print(dataset['risk_level'].value_counts())
print(f"\nDataset saved to data/landslide_dataset.csv")
print(f"\nFirst few records:")
print(dataset.head(10))
print(f"\nDataset Statistics:")
print(dataset.describe())
