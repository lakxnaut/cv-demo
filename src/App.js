import React, { useState, useEffect } from "react";
import saveAs from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import html2pdf from "html2pdf.js";
import bottomImg from "./bottom.png";
import defaultImg from "./default.png";
import Rating from "@mui/material/Rating";

const App = () => {
  const [data, setData] = useState([]);
  const [imageBase64, setImageBase64] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [EditId, setEditId] = useState();
  const [value, setValue] = React.useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://34.125.237.179:8002/api/auth/cvResume"
      );
      if (!response.status) {
      }
      const result = await response.json();
      // console.log(result)
      // console.log(result.data[0].cv_link);
      setData(result.data);
    } catch (error) {
      // setError(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (data) => {
    // console.log(data)
    setEditId(data._id);
    const finalData = {
      name: data.name,
      gen: data.gen,
      nationality: data.nationality,
      tel_no: data.tel_no,
      email: data.email,
      birthday: data.birthday,
      disponibility: data.disponibility,
      language: data.language,
      driver_licence: data.driver_licence,
      mobility: data.mobility,
      start_of_work: data.start_of_work,
      work_in_warehouse: data.work_in_warehouse,
      kind_of_activities: data.kind_of_activities,
      duration_of_work: data.duration_of_work,
      type_of_good: data.type_of_good,
      picking_sys_licence: data.picking_sys_licence,
      shoe_size: data.shoe_size,
      profile_pic: data.profile_pic,
      position: data.position,
      beruf: data.beruf,
      skill: data.skill,
    };

    setSelectedData(finalData);
  };

  const editDataChange = (data, key) => {
    setSelectedData((prevState) => ({ ...prevState, [key]: data }));
  };

  const EditSubmit = () => {
    setData([]);
    setIsLoading(true);

    const data = {
      _id: EditId,
      data: {
        ...selectedData,
      },
    };

    fetch("http://34.125.237.179:8002/api/auth/editData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // You can add other headers as needed
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        fetchData();
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  const fetchAndConvertImage = async (imageUrl) => {
    console.log(imageUrl);
    try {
      const response = await fetch(
        `http://34.125.237.179:8002/api/auth/proxyImg?img=${imageUrl}`
      );
      if (response.ok) {
        const data = await response.json();
        setImageBase64(data.data);
      }
    } catch (error) {
      console.error("Error fetching or converting image:", error.message);
    }
  };

  const callHtml = async (data) => {
    await fetchAndConvertImage(data.profile_pic);

    const profileimg = `data:image/jpg;base64,${imageBase64}`;

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
              <h4>Language Spoken</h4>
              <ul>
                  <li>Native Language - German</li>
                  <li>English Skills</li>
              </ul>
              <h4>Driving License</h4>
              <ul>
                  <li>ABC</li>
              </ul>
        <h4>Mobility</h4>
              <ul>
                  <li>Availability by Phone:</li>
                  <li>Start of Work:</li>
                  <li>Own Vehicle:</li>
              </ul>
        <h4>PROFESSION</h4>
              <ul>
                  <li>xxxx</li>
              </ul>
        <h4>OCCUPATIONS PRACTISED</h4>
              <ul>
                  <li>xxxx</li>
              </ul></h2>
              <ul>
                  <li>xxxx</li>
              </ul>
        <h4>EXPERIENCES AND SKILLS</h4>
              <ul>
                  <li>xxxx</li>
              </ul></h2>
              <ul>
                  <li>xxxx</li>
              </ul>
        <h4>ADDITIONAL INFORMATION</h4>
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
                  <img src="${profileimg}" alt="Your Image" style="width: 50%;">

              </div>
              <!-- Logo at the bottom right -->
              <div id="bottom-right">
                  <img src=${bottomImg} alt="Your Logo" style="width: 50%;">
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
    return htmlTemplate;
    // });
  };

  const generatePDF = async (data) => {
    const htmlContent = await callHtml(data);

    // Convert HTML to PDF
    html2pdf(htmlContent, {
      margin: 10,
      filename: `${data.name}`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).then((pdf) => {
      // Download the PDF
      pdf.save();
    });
  };

  const handleStar = (star, adata) => {
    const _id = adata._id;
    let stars = star.target.value;

    const mydata = {
      _id,
      stars,
    };

    fetch("http://34.125.237.179:8002/api/auth/giveStars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // You can add other headers as needed
      },
      body: JSON.stringify(mydata),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        const index = data.findIndex((doc) => doc._id === _id);
        if (index !== -1) {
         const updated = data[index]
        }
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
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
                        <th>Rating</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isLoading &&
                        data.length > 0 &&
                        data &&
                        data.slice(1).map((name, ind) => {
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
                                <Rating
                                  name="simple-controlled"
                                  value={name.stars}
                                  onChange={(e) => handleStar(e, name)}
                                />
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
                                    onClick={() => handleEditClick(name)}
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
                    <div className="form-group">
                      <label htmlFor="name">name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.name}
                        onChange={(e) => editDataChange(e.target.value, "name")}
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">Gender</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.gen}
                        onChange={(e) => editDataChange(e.target.value, "gen")}
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">nationality</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.nationality}
                        onChange={(e) =>
                          editDataChange(e.target.value, "nationality")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">tel_no</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.tel_no}
                        onChange={(e) =>
                          editDataChange(e.target.value, "tel_no")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">email</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.email}
                        onChange={(e) =>
                          editDataChange(e.target.value, "email")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">birthday</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.birthday}
                        onChange={(e) =>
                          editDataChange(e.target.value, "birthday")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">disponibility</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.disponibility}
                        onChange={(e) =>
                          editDataChange(e.target.value, "disponibility")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">language</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.language}
                        onChange={(e) =>
                          editDataChange(e.target.value, "language")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">driver_licence</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.driver_licence}
                        onChange={(e) =>
                          editDataChange(e.target.value, "driver_licence")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">mobility</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.mobility}
                        onChange={(e) =>
                          editDataChange(e.target.value, "mobility")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">start_of_work</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.start_of_work}
                        onChange={(e) =>
                          editDataChange(e.target.value, "start_of_work")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">work_in_warehouse</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.work_in_warehouse}
                        onChange={(e) =>
                          editDataChange(e.target.value, "work_in_warehouse")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">kind_of_activities</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.kind_of_activities}
                        onChange={(e) =>
                          editDataChange(e.target.value, "kind_of_activities")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">duration_of_work</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.duration_of_work}
                        onChange={(e) =>
                          editDataChange(e.target.value, "duration_of_work")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">type_of_good</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.type_of_good}
                        onChange={(e) =>
                          editDataChange(e.target.value, "type_of_good")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">picking_sys_licence</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.picking_sys_licence}
                        onChange={(e) =>
                          editDataChange(e.target.value, "picking_sys_licence")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">shoe_size</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.shoe_size}
                        onChange={(e) =>
                          editDataChange(e.target.value, "shoe_size")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">profile_pic</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.profile_pic}
                        onChange={(e) =>
                          editDataChange(e.target.value, "profile_pic")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">position</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.position}
                        onChange={(e) =>
                          editDataChange(e.target.value, "position")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">beruf</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.beruf}
                        onChange={(e) =>
                          editDataChange(e.target.value, "beruf")
                        }
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="name">skill</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedData?.skill}
                        onChange={(e) =>
                          editDataChange(e.target.value, "skill")
                        }
                        placeholder=""
                      />
                    </div>
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
                    onClick={EditSubmit}
                    data-dismiss="modal"
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
