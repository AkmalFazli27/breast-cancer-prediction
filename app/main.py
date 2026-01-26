import streamlit as st
import pickle as pickle
import pandas as pd
import plotly.graph_objects as go

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

def get_radar_chart(input_data):
    categories = ['processing cost','mechanical properties','chemical stability',
              'thermal stability', 'device integration']

    fig = go.Figure()

    fig.add_trace(go.Scatterpolar(
        r=[1, 5, 2, 2, 3],
        theta=categories,
        fill='toself',
        name='Product A'
    ))
    fig.add_trace(go.Scatterpolar(
        r=[4, 3, 2.5, 1, 2],
        theta=categories,
        fill='toself',
        name='Product B'
    ))

    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 5]
            )),
        showlegend=False
    )

    return fig

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
        st.write("this is col2")

if __name__ == '__main__':
    main()

