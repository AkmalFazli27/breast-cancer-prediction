import streamlit as st
import joblib
import pandas as pd
import plotly.graph_objects as go
import numpy as np

def get_clean_data():
    data = pd.read_csv("D:\\Ameng\\Data Science Project\\breast-cancer-prediciton\\data\\processed\\removed_multicollinearity.csv")
    data = data.drop(['id'], axis=1)
    return data

def add_sidebar():
    st.sidebar.header("Cell Nuclei Measurements")
    data = get_clean_data()

    slider_labels = []
    for col in data.columns:
        if col != 'diagnosis':
            label = col.replace('_', ' ').title()
            slider_labels.append((label, col))
    
    input_dict = {}
    
    for label, key in slider_labels:
        input_dict[key] = st.sidebar.slider(
            label,
            min_value=0.0,
            max_value=float(data[key].max() * 1.2),
            value=float(data[key].mean())
        )
    
    return input_dict

def get_scaled_values(input_dict):
    data = get_clean_data().drop(['diagnosis'], axis=1)

    scaled_dict = {}
    
    for key, value in input_dict.items():
        max_val = data[key].max()
        min_val = data[key].min()
        scaled_value = (value - min_val) / (max_val - min_val)
        scaled_dict[key] = scaled_value
    
    return scaled_dict

def get_radar_chart(input_data):
    input_data = get_scaled_values(input_data)

    ordered_bases = ['concavity', 'area', 'symmetry', 'concave points', 'texture', 'compactness', 
                     'smoothness', 'fractal_dimension']


    def get_trace_data(suffix, data, bases):
        r_values = []
        theta_values = []
        
        for base in bases:
            key = f"{base}_{suffix}" 
            
            if key in data:
                r_values.append(data[key])
                label = base.replace('_', ' ').title()
                theta_values.append(label)
        if r_values:
            r_values.append(r_values[0])
            theta_values.append(theta_values[0])

        return r_values, theta_values

    r_mean, theta_mean   = get_trace_data('mean', input_data, ordered_bases)
    r_se, theta_se       = get_trace_data('se', input_data, ordered_bases)
    r_worst, theta_worst = get_trace_data('worst', input_data, ordered_bases)

    fig = go.Figure()

    # Mean values
    if r_mean:
        fig.add_trace(go.Scatterpolar(
            r=r_mean, theta=theta_mean,
            fill='toself', name='Mean Value',
            line=dict(color='blue',)
        ))

    # SE values
    if r_se:
        fig.add_trace(go.Scatterpolar(
            r=r_se, theta=theta_se,
            fill='toself', name='Standard Error',
            line=dict(color='orange')
        ))

    # Worst values
    if r_worst:
        fig.add_trace(go.Scatterpolar(
            r=r_worst, theta=theta_worst,
            fill='toself', name='Worst Value',
            line=dict(color='red')
        ))

    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 1])
        ),
        showlegend=True,
        margin=dict(l=80, r=80, t=50, b=50)
    )

    return fig

def add_prediction(input_data):
    model = joblib.load('models/final_model_random_forest.pkl')
    slice = joblib.load('models/scaler.pkl')

    input_array = np.array(list(input_data.values())).reshape(1, -1)

    st.write(input_array)

def main():
    st.set_page_config(
        page_title="Breast Cancer Predictor",
        page_icon=":female-doctor:",
        layout="wide",
        initial_sidebar_state="expanded"
    )

    input_data = add_sidebar()

    with st.container():
        st.title("Breast Cancer Predictor")
        st.write(
            """
            This app predicts whether a breast mass is **Benign** or **Malignant** 
            based on measurements from a digitized image of a fine needle aspirate (FNA) 
            of a breast mass. Update the measurements using the sliders in the sidebar 
            to get a prediction.
            """)
    
    col1, col2 = st.columns([4,1])

    with col1:
        radar_chart = get_radar_chart(input_data)
        st.plotly_chart(radar_chart)

    with col2:
        add_prediction(input_data)

if __name__ == '__main__':
    main()

