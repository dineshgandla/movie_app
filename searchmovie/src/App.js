import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError({ status: false, msg: "" });
    fetch(`http://www.omdbapi.com/?s=${search}&apikey=87dff44a`)
      .then((response) => response.json())
      .then((res) => {
        setData(res.Search);
        setLoading(false);
        setIsError({ status: false, msg: "" });

        if (!res.Search) {
          throw new Error("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setIsError({
          status: true,
          msg: error.message || "Something went wrong..",
        });
      });
  };

  //when data is being fetched from the api , we cannot directly download images from the webpage, so for downloading images we have to create objectURL//

  //objectURL code starts here//

  const getPoster = (url, title) => {
    fetch(url)
      .then((response) =>
        response.arrayBuffer().then((buffer) => {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${title}.jpg`);
          document.body.appendChild(link);
          link.click();
        })
      )

      .catch((err) => {
        console.log(err);
      });
  };

  //objectURL code ends here//

  return (
    <div>
      <center>
        <h5 style={{ marginTop: "10px" }}>Find Something to Watch</h5>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            id="search"
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <br></br>

          <button type="submit" className="btn btn-primary submit-btn">
            Search
          </button>
        </form>
        {loading && !isError?.status && <h5 className="loading">Loading...</h5>}
        {isError?.status && (
          <h5 style={{ color: "red", marginTop: "10px" }}>{isError.msg}</h5>
        )}

        {!loading && !isError.status && (
          <div className="card-container">
            {data.map((val) => {
              const { Title, Year, imdbID, Poster, Type } = val;
              return (
                <Card style={{ width: "18rem" }} key={imdbID}>
                  <Card.Img
                    variant="top"
                    src={Poster}
                    style={{ width: "287px", height: "300px" }}
                  />

                  <Card.Body>
                    <Card.Title className="title">
                      <h5>{Title} </h5>
                    </Card.Title>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="list_group_item">
                      <b style={{ color: "green" }}>Year : </b>
                      {Year}
                    </ListGroup.Item>

                    <ListGroup.Item className="list_group_item">
                      <b style={{ color: "red" }}>Type : </b>
                      {Type}
                    </ListGroup.Item>
                  </ListGroup>
                  <a>
                    <button
                      className="btn btn-primary download-btn"
                      onClick={() => getPoster(Poster, Title)}
                    >
                      Download Poster
                    </button>
                  </a>
                </Card>
              );
            })}
          </div>
        )}
      </center>
    </div>
  );
};

export default App;
