import React from 'react';
import { useState } from 'react';
import './SearchPage.css';
import asyncFetchTrackData from './asyncFetchTrackData.js';

function SearchPage(props) {
  console.log("update")
  /** 
  * Temporary fix to the problem where css styles from other stylesheets
  * will apply to html elements in this component if the id or class names
  * match. Obviously, we only want styles from our own specifically imported
  * stylesheet to be applied, so this is a problem. A fix could be to make sure 
  * no id or class names are named the same as any selectors in other components' 
  * stylesheets. We could assign a unique id to each component, and append the 
  * unique id to every id or class in the component, which should guarantee that
  * no two components share the same class or id names.
  */
  const uniqueComponentID = "search-page";

  const API_KEY = process.env.REACT_APP_NAPSTER_API_KEY;
  const [trackData, setTrackData] = useState({actualTrackData: [], isDataRetrieved: false});
  // const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  /**
  * Router automatically passes in some props. 
  * The query parameters for the API call can be found in props.location.search.
  * As of now props.location.search is in the form '?query=searchString&type=track'
  * and we must cut off the ? to get the query parameters by themselves
  */
  if (!trackData.isDataRetrieved) {
    const queryParameters = props.location.search.split("?")[1];
    let finalTrackData = [];
    asyncFetchTrackData(queryParameters, API_KEY).then(fetchedTrackData => {
      // still need to extract specific track data from result of API call
      console.log("track data: ", fetchedTrackData.search.data.tracks);
      // order in which the track appears
      let trackOrder = 1;
      fetchedTrackData.search.data.tracks.forEach(track => {
        finalTrackData.push({
          trackImageSrc: "https://api.napster.com/imageserver/v2/albums/" + track.albumId + "/images/500x500.jpg",
          trackID: track.id,
          trackName: track.name,
          trackArtist: track.artistName,
          trackOrder: trackOrder
        })
        trackOrder++;
      })
      console.log("final tracks data: ", finalTrackData);
      setTrackData({actualTrackData: finalTrackData, isDataRetrieved: true})
    })
  }

  let trackDOMElements = [];
  // create elements only if data is ready and data exists
  if (trackData.isDataRetrieved && trackData.actualTrackData.length) {
    trackData.actualTrackData.forEach(track => {
      trackDOMElements.push(
        <div className={`${uniqueComponentID + "-track"} ${uniqueComponentID + "-flex-row-container"}`}>
          <img src={track.trackImageSrc} alt={"Album cover of " + track.trackName} className={uniqueComponentID + "-track-image"} />
          <div className={`${uniqueComponentID + "-track-info"} ${uniqueComponentID + "-flex-row-container"}`}>
            <div className={`${uniqueComponentID + "-track-order"}`}>
              <span>{`${track.trackOrder + "."}`}</span>
            </div>
            <div className={`${uniqueComponentID + "-track-name-and-artist"} ${uniqueComponentID + "-flex-column-container"}`}>
              <span className={`${uniqueComponentID + "-track-name"}`}>
                {track.trackName}
              </span>
              <span className={`${uniqueComponentID + "-track-artist"}`}>
                {track.trackArtist}
              </span>
            </div>
          </div>
        </div>
      )
    })
  }

  /**
  * Explanation of below code:
  * If data has been retrieved, check if there is any data to be displayed.
  * If there is, display the tracks. If not, display 'no songs found'.
  * If data hasn't been retrieved, display 'Loading...'
  */

  return (
    <div id="search-page" className={uniqueComponentID + "-flex-column-container"}>
        {trackData.isDataRetrieved 
          ? <div id={uniqueComponentID + "-top-matching-songs"} className={uniqueComponentID + "-flex-column-container"}>
              <h2>Top Matching Songs</h2>
              {trackData.actualTrackData.length
                ? 
                  <div id={uniqueComponentID + "-track-list"} className={uniqueComponentID + "-flex-column-container"}>
                    {trackDOMElements}
                  </div>
                :
                  <h3>No songs found!</h3> 
              }
            </div>
          :
            <div id={uniqueComponentID + "-top-matching-songs"} className={uniqueComponentID + "-flex-column-container"}>
              <h2>Top Matching Songs</h2>
              <span>Loading...</span>
            </div>
        }
    </div>
  );
}

export default SearchPage;