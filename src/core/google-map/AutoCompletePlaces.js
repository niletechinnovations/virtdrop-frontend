import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import './AutoCompletePlaces.css';


class AutoCompletePlaces extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '', latitude:'', longitude:'', scriptLoading: false };
  }
  
  componentDidMount() { 
      if(typeof google === "undefined") {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = `https://maps.google.com/maps/api/js?key=AIzaSyBaq7mc_lts3Xensjk7JvnUU1q8dNG0avo&libraries=places`;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
        s.addEventListener('load', e => {
            this.setState({scriptLoading: true});
        })
      }
      else
        this.setState({scriptLoading: true});
    //this.setState({ address:this.props.setAddress });

  }
  handleChange = address => {
    this.setState({ address });
    if(address === "")
      this.props.setLatitudeLongitude(address,{lat:"", lng:""});
  };
 
  handleSelect = address => {
    this.setState({ address });
    console.log(address);
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      //.then(latLng => console.log('Success', latLng))
      .then( 
        latLng => this.props.setLatitudeLongitude(address,latLng) 
      )
      /*.then(({ lat, lng }) =>
        this.setState({ latitude:lat, longitude:lng })
        
        //this.props.setLatitudeLongitude(latLng)
      )*/
      .catch(error => console.error('Error', error));
  };
 
  render() {
    let address = ( (this.state.address==='' && this.props.truckAdress) ? this.props.truckAdress : this.state.address );
    console.log(address);
    
    if(!this.state.scriptLoading)
      return (<></>);
    
    return (
      <>
      
      
      <PlacesAutocomplete
        value={address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                name: 'address',
                placeholder: 'Search Your Location ...',
                className: 'form-control location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <strong>
                      {suggestion.formattedSuggestion.mainText}
                    </strong>{' '}
                    <small>
                      {suggestion.formattedSuggestion.secondaryText}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      </>
    );
    
  }
}
export default AutoCompletePlaces;