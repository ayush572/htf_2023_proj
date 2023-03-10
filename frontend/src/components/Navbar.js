import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abi from "./../abi/Voting.json";
// import Chapters from "./Chapters";
// exoport components
const Navbar = ({ acc, setAcc }) => {
  // STATES
  const [catId, setCatId] = useState(null);
  const [data, setData] = useState([]);
  const [evData, setEvData] = useState([]);
  const [event, setEvent] = useState(null);
  const [able, setAble] = useState([
    {
      cat_id: null,
      visited: [],
      votable: false,
    },
  ]);

  // HANDLERS

  let connectHandler = async () => {
    let accs = await window.ethereum.request({ method: "eth_requestAccounts" });
    let account = ethers.utils.getAddress(accs[0]);
    setAcc(account);
  };
  function categoryHandler(cat_id) {
    setCatId(cat_id);
    console.log(catId);
  }

  // use effect
  useEffect(() => {
    const ables = [];
    data.map((d) => {
      ables.push({
        cat_id: d.id,
        visitedAll: 0,
        votable: false,
      });
    });
    setAble(ables);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("http://localhost:4000/catagorie");
      const evResult = await fetch("http://localhost:4000/events");
      const json = await result.json();
      const evJson = await evResult.json();
      // adde
      setData(json);
      setEvData(evJson);
    };
    fetchData();
  }, []);
  // Web3
    const handleVoteClick = async (event) => {
      console.log(event);
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // console.log(abi)
        try{
        const voteContract = new ethers.Contract("0x0f989B4A4aE5648aDB776c74F42C9bCcA3DF1009", abi, signer);
        console.log(voteContract);
        // await voteContract.Voting([event,"event2"]);
        await voteContract.voteFor_event(event);
        const totalNumber = await voteContract.totalVotesFor(event);
        console.log(totalNumber);
        }catch{

          console.log("Not Created")
        }
        
        
      }
    }
  return (
    <div>
      <div className="main_nav">
        <div className="nav_title">
          <h1>SCDAO</h1>
        </div>
        {/* <input type="text" className="nav_search"></input> */}
        {/* 
        here it means that if the account is not connected then connect it
        by showing the connect button or if its connected then simply
        connect it */}

        {acc ? (
          <button type="button" className="nav_connect">
            {acc.slice(0, 6) + "..." + acc.slice(36, 42)}
          </button>
        ) : (
          <button
            type="button"
            className="nav_connect"
            onClick={connectHandler}
          >
            {acc ? acc : "Connect"}
          </button>
        )}
      </div>

      {catId === null ? (
        <ul className="nav_links">
          {data.map((d) => {
            return (
              <button onClick={() => categoryHandler(d.id)} key={d.id}>
                {d.title}
              </button>
            );
          })}
        </ul>
      ) : (
        data.map((d) => {
          if (d.id === catId) {
            return (
              <div className="clubs-card-container">
                {d.clubs.map((cl, index) => {
                  return (
                    <div
                      onClick={() => {
                        setEvent(cl);
                      }}
                      className="clubs-card"
                    >
                      <div className="clubs-card-header">
                        <h3>{cl}</h3>
                      </div>
                      <div className="clubs-card-body">
                        <p>{"Club Description goes here"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
        })
      )}
      {event != null
        ? Object.keys(evData).map((e) => {
          // console.log(event.toLowerCase());
          if (e === event.toLowerCase()) {
            return (
              <div className="event-card">
                <div className="event-card-header">
                  <h3>{evData[e].title}</h3>
                </div>
                <div className="event-card-body">
                  <p>{evData[e].description}</p>
                </div>
                <button onClick={() => handleVoteClick(evData[e].title)}>Vote</button>
              </div>
            );
          }
        })
        : null}
      {event != null ? (
        <button
          onClick={() => {
            setEvent(null);
            setCatId(null);
          }}
        >
          Back
        </button>
      ) : null}
    </div>
  );
};

export default Navbar;
