import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import './MapContainer.scss';
import { connect } from 'react-redux';
import { SET_MAP_STATE } from '../../../../redux/const/map';
import GeoCode from 'react-geocode';


class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: true,
            activeMarker: {},
            selectedPlace: {},
            marker: {
                lat: 0, lng: 0
            },
            location: ''
        };

    }

    componentWillMount() {
        let { marker } = this.props.mapState;
        this.setState({ marker });
        GeoCode.setApiKey("AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28")
    }

    _onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    _setMapState = (t, map, coord) => {
        const { latLng } = coord;
        let { marker } = this.state;
        const lat = latLng.lat();
        const lng = latLng.lng();
        marker.lat = lat;
        marker.lng = lng;
        GeoCode.fromLatLng(marker.lat, marker.lng).then(
            response => {
                let { location } = this.state;
                location = response.results[0].formatted_address;
                localStorage.setItem('location', location);
                this.setState({ location, marker });
                this.props.setMapState(marker, location);
            },

            error => {
                console.error(error);
            }
        )
    }

    render() {
        let { marker, location, showingInfoWindow, activeMarker} = this.state;
        return (
            <Map className='map-wraper'
                google={window.google}
                initialCenter={this.props.mapState.marker}
                onClick={this._setMapState}>
                <Marker onClick={this._onMarkerClick}
                    name={location}
                    position={{ lat: marker.lat, lng: marker.lng }}
                />
                
                <InfoWindow
                    marker={activeMarker}
                    visible={showingInfoWindow}>
                    <div>
                        <h5>{this.state.selectedPlace.name}</h5>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

const mapStateTopProps = state => ({
    mapState: state.handleMapState
})

const mapDispatchToProps = dispatch => {
    return {
        setMapState: (marker, location) => dispatch({ type: SET_MAP_STATE, marker, location })
    }
}

export default connect(mapStateTopProps, mapDispatchToProps)(GoogleApiWrapper({
    apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28'
})(MapContainer))