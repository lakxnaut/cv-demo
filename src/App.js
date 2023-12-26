import React, { useState, useEffect } from 'react';
import saveAs from 'file-saver';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';


const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://34.125.237.179:8002/api/auth/cvResume');
        if (!response.status) {
          
        }
        const result = await response.json();
        // console.log(result)
        console.log(result.data[0].cv_link)
        setData(result.data);
      } catch (error) {
        // setError(error);
      }
    };

    fetchData();
  }, []); 


  const convertBuffer = (bufferData) =>{
    const generatedPdfBytes = createPDF(bufferData.data);
        const data = generatedPdfBytes;

        try {
          const buffer = Buffer.from(data);
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          const { width, height } = page.getSize();
    
          const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
          const text = 'Hello, PDF!';
          page.drawText(text, { x: 50, y: height - 200, font });
    
          return pdfDoc.save();
        } catch (error) {
          throw new Error('Error creating PDF:', error);
        }
      };


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

                                                            onClick={() => convertBuffer(name.cv_link)}
                                                         
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

 