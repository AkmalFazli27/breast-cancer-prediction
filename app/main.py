import streamlit as st
import pickle as pickle
import pandas as pd

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
    
    for label, key in slider_labels:
        st.sidebar.slider(
            label,
            min_value=0.0,
            max_value=float(data[key].max() * 1.2),
            value=float(data[key].mean())
        )

def main():
    st.set_page_config(
        page_title="Breast Cancer Predictor",
        page_icon=":female-doctor:",
        layout="wide",
        initial_sidebar_state="expanded"
    )

    add_sidebar()

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
        st.write("this is col 1")

    with col2:
        st.write("this is col2")

if __name__ == '__main__':
    main()

