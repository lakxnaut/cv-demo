import React, { useState, useEffect } from 'react';
import saveAs from 'file-saver';
import JSZip from 'jszip';


const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxK2Y-VXnQ6g20J7cRQEa4-PPO13tmawodaxD821WJ-Nv8JLatHbFyGQMQnuoBLdgm2/exec');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data when the component mounts
    fetchData();
  }, []);

  const generateDocx = (dataItem) => {
    console.log(dataItem.profile_pic)
    if (window.htmlDocx) {
      // Additional details
      const languagesSpoken = dataItem.language.split(', ').map(lang => `● ${lang}`).join('\n');
      const drivingLicence = dataItem.driver_licence ? `● ${dataItem.driver_licence}` : 'N/A';
      const mobility = dataItem.mobility ? dataItem.mobility.split(', ').map(mob => `● ${mob}`).join('\n') : 'N/A';
      const profession = dataItem.position ? `● ${dataItem.position}` : 'N/A';
      const occupationsPracticed = dataItem.kind_of_activities ? dataItem.kind_of_activities.split(', ').map(act => `● ${act}`).join('\n') : 'N/A';
      const experiencesAndSkills = dataItem.type_of_good ? dataItem.type_of_good.split(', ').map(skill => `● ${skill}`).join('\n') : 'N/A';
      const additionalInformation = dataItem.additional_information ? `● ${dataItem.additional_information}` : 'N/A';

      // Template for generating DOCX
      const content = `
      <head>
      <style type="text/css">
    body {
        display: flex;
        margin:1000px
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
</style>
      </head>
      <div style="padding: 200px;">
        <div class="title">
        <div>

        <img
            alt="User's Image"
            width="100"
            height="100"
            src=${dataItem.profile_pic}
            style={{ position: 'absolute', top: 0, right: 0 }}
          />
        
        </div>
        <div>

        <h1>${dataItem.name}</h1>
          <p>Gender: ${dataItem.gen}</p>
          <p>Nationality: ${dataItem.nationality}</p>
          <p>Date of Birth: ${dataItem.birthday}</p>
          <p>Phone Number: ${dataItem.tel_no}</p>
          <p>E-Mail: ${dataItem.email}</p>
        
        </div>

        
        
        
        </div>

      

          <h2>LANGUAGES SPOKEN</h2>
          ${languagesSpoken}

          <h2>DRIVING LICENCE</h2>
          ${drivingLicence}

          <h2>MOBILITY</h2>
          ${mobility}

          <h2>PROFESSION</h2>
          ${profession}

          <h2>OCCUPATIONS PRACTISED</h2>
          ${occupationsPracticed}

          <h2>EXPERIENCES AND SKILLS</h2>
          ${experiencesAndSkills}

          <h2>ADDITIONAL INFORMATION</h2>
          ${additionalInformation}

          
        </div>
      `;

      const converted = window.htmlDocx.asBlob(content);
      saveAs(converted, `${dataItem.name} CV.docx`);
    } else {
      console.error('htmlDocx is not defined. Make sure the html-docx.js script is loaded.');
    }
  };

  const downloadAllCV = async()=>{

    const zip = new JSZip();


    for(let dataItem of data){

        if (window.htmlDocx) {
          // Additional details
          const languagesSpoken = dataItem.language.split(', ').map(lang => `● ${lang}`).join('\n');
          const drivingLicence = dataItem.driver_licence ? `● ${dataItem.driver_licence}` : 'N/A';
          const mobility = dataItem.mobility ? dataItem.mobility.split(', ').map(mob => `● ${mob}`).join('\n') : 'N/A';
          const profession = dataItem.position ? `● ${dataItem.position}` : 'N/A';
          const occupationsPracticed = dataItem.kind_of_activities ? dataItem.kind_of_activities.split(', ').map(act => `● ${act}`).join('\n') : 'N/A';
          const experiencesAndSkills = dataItem.type_of_good ? dataItem.type_of_good.split(', ').map(skill => `● ${skill}`).join('\n') : 'N/A';
          const additionalInformation = dataItem.additional_information ? `● ${dataItem.additional_information}` : 'N/A';
          // Template for generating DOCX
          const content = `
          <head>
          <style type="text/css">
        body {
            display: flex;
            margin:1000px
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
    </style>
          </head>
          <div style="padding: 200px;">
            <div class="title">
            <div>
    
            <img
                alt="User's Image"
                width="100"
                height="100"
                src=${dataItem.profile_pic}
              />
            
            </div>
            <div>
    
            <h1>${dataItem.name}</h1>
              <p>Gender: ${dataItem.gen}</p>
              <p>Nationality: ${dataItem.nationality}</p>
              <p>Date of Birth: ${dataItem.birthday}</p>
              <p>Phone Number: ${dataItem.tel_no}</p>
              <p>E-Mail: ${dataItem.email}</p>
            
            </div>
            </div>
              <h2>LANGUAGES SPOKEN</h2>
              ${languagesSpoken}
    
              <h2>DRIVING LICENCE</h2>
              ${drivingLicence}
    
              <h2>MOBILITY</h2>
              ${mobility}
    
              <h2>PROFESSION</h2>
              ${profession}
    
              <h2>OCCUPATIONS PRACTISED</h2>
              ${occupationsPracticed}
    
              <h2>EXPERIENCES AND SKILLS</h2>
              ${experiencesAndSkills}
    
              <h2>ADDITIONAL INFORMATION</h2>
              ${additionalInformation}
              
            </div>
          `;

        const converted = window.htmlDocx.asBlob(content);
        zip.file(`${dataItem.name} CV.docx`, converted);
          // saveAs(converted, `GeneratedDocument_${dataItem.name}.docx`);
        } 

    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Download the zip file
    saveAs(zipBlob, 'GeneratedDocuments.zip');

  }

  return (
    <div className='content-page rtl-page'>
        <div className='container-fluid'>
        </div>
        <div className='row'>
            <div className='col-sm-12 col-lg-12'>
                <div className='card'>
                    <div className='card-header d-flex justify-content-between'>
                        <div className='header-title'>
                            <h4 className='card-title'>View all CV</h4>
                        </div>
                        <div className='header-title'>
                            <button onClick={downloadAllCV} className='card-title'>Download All CV</button>
                        </div>
                    </div>
                    <div className='card-body'>

                        <div className='table-responsive'>
                            <table className='table  table-striped table-bordered'>
                                <thead>
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Name</th>
                                        <th>Gender</th>
                                        <th>Nationality</th>
                                        <th>TelPhone</th>
                                        <th>E-mail</th>
                                        <th>Disponsibilty</th>
                                        <th>Language</th>
                                        <th>Driver Licence</th>
                                        <th>Image</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(1).map((name, ind) => {
                                        return (
                                            <tr key={ind}>
                                                <td>{++ind}</td>
                                                <td>{name.name}</td>
                                                <td>{name.gen}</td>
                                                <td>{name.nationality}</td>
                                                <td>{name.tel_no}</td>
                                                <td>{name.email}</td>
                                                <td>{name.disponibility}</td>
                                                <td>{name.language}</td>
                                                <td>{name.driver_licence}</td>
                                                <td><img src={name.profile_pic} height={'100'}/></td>

                                                <button
                                                            type='button'
                                                            className='btn btn-sm'
                                                            style={{
                                                                backgroundColor:'green',
                                                                color:'white',
                                                                justifyItems:'center',
                                                                alignItems:'center !important'
                                                            }}

                                                            onClick={() => generateDocx(name)}
                                                         
                                                        >
                                                            Download CV
                                                        </button>
                                                 
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    </div>
    // </div>
    // </div>
);

  // return (
  //   <div>
  //     {/* Render your data, for example, in a list */}
  //     <ul>
  //       {data.slice(1).map(item => (
  //         <li key={item.id} onClick={() => generateDocx(item)}>
  //           {item.name}
            
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
};

export default App;

 