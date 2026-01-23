import streamlit as st
import pickle as pickle
import pandas as pd

def main():
    st.set_page_config(
        page_title="Breast Cancer Predictor",
        page_icon=":female-doctor:",
        layout="wide",
        initial_sidebar_state="expanded"
    )

    with st.container():
        st.title("Breast Cancer Predictor")
        st.write(
            """
            This app predicts whether a breast mass is **Benign** or **Malignant** 
            based on measurements from a digitized image of a fine needle aspirate (FNA) 
            of a breast mass. Update the measurements using the sliders in the sidebar 
            to get a prediction.
            """)


if __name__ == '__main__':
    main()

