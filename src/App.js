import React, { useState, useEffect } from "react";
import saveAs from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import html2pdf from "html2pdf.js";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://34.125.237.179:8002/api/auth/cvResume"
        );
        if (!response.status) {
        }
        const result = await response.json();
        // console.log(result)
        console.log(result.data[0].cv_link);
        setData(result.data);
      } catch (error) {
        // setError(error);
      }
    };

    fetchData();
  }, []);

  const EditView = () => {};
  const editData = [
    { name: "name" },
    { name: "gen" },
    { name: "nationality" },
    { name: "tel_no" },
    { name: "email" },
    { name: "birthday" },
    { name: "disponibility" },
    { name: "language" },
    { name: "driver_licence" },
    { name: "mobility" },
    { name: "start_of_work" },
    { name: "work_in_warehouse" },
    { name: "kind_of_activities" },
    { name: "duration_of_work" },
    { name: "type_of_good" },
    { name: "picking_sys_licence" },
    { name: "shoe_size" },
    { name: "profile_pic" },
    { name: "position" },
    { name: "beruf" },
    { name: "skill" },
  ];

  const callHtml = (data) => {
    const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
          }
          #container {
              display: flex;
              justify-content: space-between;
          }
          #left-column {
              width: 60%;
          }
          #right-column {
              width: 30%;
              position: relative;
          }
          hr {
              border: 1px solid #000;
          }
          #top-right {
              position: absolute;
              top: 0;
              right: 0;
              width: 100%;
              text-align: right;
              margin-top: 10px;
          }
          #bottom-right {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 100%;
              text-align: right;
              margin-bottom: 10px;
          }
      </style>
      <title>Your CV</title>
  </head>
  <body>
      <div id="container">
          <div id="left-column">
              <h1>${data.name}</h1>
              <p>Gender:${data.gen}</p>
              <p>Nationality:${data.nationality}</p>
              <p>Date of Birth:${data.birthday}</p>
              <p>Phone:${data.tel_no}</p>
              <p>Email:${data.email}</p>
              <hr>
              <h2>Language Spoken</h2>
              <ul>
                  <li>Native Language - German</li>
                  <li>English Skills</li>
              </ul>
              <h2>Driving License</h2>
              <ul>
                  <li>ABC</li>
              </ul>
        <h2>Mobility</h2>
              <ul>
                  <li>Availability by Phone:</li>
                  <li>Start of Work:</li>
                  <li>Own Vehicle:</li>
              </ul>
        <h2>PROFESSION</h2>
              <ul>
                  <li>xxxx</li>
              </ul>
        <h2>OCCUPATIONS PRACTISED</h2>
              <ul>
                  <li>xxxx</li>
              </ul></h2>
              <ul>
                  <li>xxxx</li>
              </ul>
        <h2>EXPERIENCES AND SKILLS</h2>
              <ul>
                  <li>xxxx</li>
              </ul></h2>
              <ul>
                  <li>xxxx</li>
              </ul>
        <h2>ADDITIONAL INFORMATION</h2>
              <ul>
                  <li>xxxx</li>
              </ul></h2>
              <ul>
                  <li>xxxx</li>
              </ul>
          </div>
          <div id="right-column">
              <!-- Image at the top right -->
              <div id="top-right">
                  <img src="${data.profile_pic}" alt="Your Image" style="width: 50%;">

              </div>
              <!-- Logo at the bottom right -->
              <div id="bottom-right">
                  <img src="https://i.ibb.co/W34pCBQ/image003.png" alt="Your Logo" style="width: 50%;">
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
    return htmlTemplate;
  };

  const generatePDF = (data) => {
    const htmlContent = callHtml(data);

    // Convert HTML to PDF
    html2pdf(htmlContent, {
      margin: 10,
      filename: "your_cv.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).then((pdf) => {
      // Download the PDF
      pdf.save();
    });
  };

  return (
    <div className="content-page rtl-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">View all CV</h4>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table  table-striped table-bordered">
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
                            <td>
                              <img src={name.profile_pic} height={"100"} />
                            </td>
                            <td>
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    justifyItems: "center",
                                    alignItems: "center !important",
                                    marginBottom: "10px",
                                  }}
                                  onClick={() => generatePDF(name)}
                                >
                                  Download CV
                                </button>
                                &nbsp; &nbsp;
                                <button
                                  title="Edit"
                                  type="button"
                                  onClick={() => EditView()}
                                  style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    justifyItems: "center",
                                    alignItems: "center !important",
                                  }}
                                  className="btn btn-sm btn-skyblue"
                                  data-toggle="modal"
                                  data-target="#exampleModalScrollable"
                                >
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="exampleModalScrollable"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalScrollableTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-scrollable"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalScrollableTitle">
                    Edit CV
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    {editData &&
                      editData.length > 0 &&
                      editData.map((data, i) => {
                        return (
                          <div className="form-group" key={data.name}>
                            <label htmlFor="name">{data.name}</label>
                            <input
                              type="text"
                              className="form-control"
                              value={data.name} // Use the corresponding property from the data object
                              // onChange={EditSeriesChange} // Uncomment this line if you have an onChange handler
                              placeholder={data.name}
                            />
                          </div>
                        );
                      })}
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    // onClick={EditSubmit}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
