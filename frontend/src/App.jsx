import AnimatedHeader from "./components/AnimatedHeader";
import UploadZone from "./components/UploadZone";
import cartoon from "./assets/robot_image.png";
import Tilt from "react-parallax-tilt";
import ResultSection from "./components/ResultSection";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

function App() {
  const [predictions, setPredictions]= useState([]);
  // const handleFileUpload = async(file) => {
  //   console.log("Uploaded File:", file.name);
  //   const formData= new FormData();
  //   formData.append("file" ,file);

  //   try{
  //     const res= await fetch("http://localhost:5000/predict", {
  //       method: "POST",
  //       body: formData
  //     });
  //     const data= await res.json();
  //     setPredictions(data.predictions)
  //   }
  //   catch(err){
  //     console.log("Upload failed", err);
  //   }
  // };


  // const fakePredictions = [
  //   {
  //     employeeName: "Jane Smith",
  //     prediction: "Likely to Leave",
  //     probability: 0.87,
  //     topFactors: ["BusinessTravel", "JobRole", "Satisfaction"],
  //     feedback: "High attrition risk due to frequent travel and low satisfaction.",
  //   },
  //   {
  //     employeeName: "John Doe",
  //     prediction: "Not Likely to Leave",
  //     probability: 0.12,
  //     topFactors: ["Age", "JobLevel", "WorkLifeBalance"],
  //     feedback: "Stable employee with high job satisfaction and work-life balance.",
  //   },
  //   {
  //     employeeName: "Jane Smith",
  //     prediction: "Likely to Leave",
  //     probability: 0.87,
  //     topFactors: ["BusinessTravel", "JobRole", "Satisfaction"],
  //     feedback: "High attrition risk due to frequent travel and low satisfaction.",
  //   },
  //   {
  //     employeeName: "John Doe",
  //     prediction: "Not Likely to Leave",
  //     probability: 0.12,
  //     topFactors: ["Age", "JobLevel", "WorkLifeBalance"],
  //     feedback: "Stable employee with high job satisfaction and work-life balance.",
  //   },
  // ];

  return (
    <>
    <ToastContainer position="top-center" />
    <div className="min-h-screen flex flex-col gap-10 items-center justify-start pt-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <AnimatedHeader />
      <div className="flex flex-col md:flex-row gap-10 items-center mt-8">
        <Tilt
          tiltMaxAngleX={0} 
          tiltMaxAngleY={40} 
          scale={1.02} 
          transitionSpeed={1500} 
          perspective={900} 
          glareEnable={false} 
          style={{ background: "transparent" }}
        >
          <img
            src={cartoon}
            alt="AI Robot"
            className="w-[300px] md:w-[400px] select-none pointer-events-none"
            draggable="false"
          />
        </Tilt>

        <UploadZone setPredictions={setPredictions} />
      </div>
      <ResultSection predictions={predictions} />

    </div>
    </>
  );
}

export default App;
