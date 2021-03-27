import React, {Component} from 'react';
import '../../css/ui/Object.scss';

export default class Objects extends Component{
  // constructor(props){
  //   super(props);
  // }

  componentDidMount(){
    // console.log('Object UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Object UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    // console.log('Object UI Unmount');
  }

  documentUpdate = () => {
    document.getElementById("lockScale").checked = this.props.getLockScale();
  }

  handleScaleXChange = (event) => {
    this.props.scaleXChange(event.target.value);
  }

  handleScaleYChange = (event) => {
    this.props.scaleYChange(event.target.value);
  }

  flipObject = (event) => {
    let option = event.target.getAttribute('flip');
    this.props.flipObject(option);
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Object ( {this.props.object.type} )
        </div>
        <div className="sub-objmenu">
          <div className="option-title">Order</div>
          <div className="obj-order">
            <svg onClick={this.props.bringToFront} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path d="M 5 2 C 3.346 2 2 3.346 2 5 L 2 21 C 2 22.654 3.346 24 5 24 L 12 24 L 12 35 C 12 36.64497 13.35503 38 15 38 L 26 38 L 26 45 C 26 46.654 27.346 48 29 48 L 45 48 C 46.654 48 48 46.654 48 45 L 48 29 C 48 27.346 46.654 26 45 26 L 38 26 L 38 15 C 38 13.35503 36.64497 12 35 12 L 24 12 L 24 5 C 24 3.346 22.654 2 21 2 L 5 2 z M 15 14 L 35 14 C 35.56503 14 36 14.43497 36 15 L 36 35 C 36 35.56503 35.56503 36 35 36 L 15 36 C 14.43497 36 14 35.56503 14 35 L 14 15 C 14 14.43497 14.43497 14 15 14 z"/>
            </svg>
            <svg onClick={this.props.sendToBack} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path d="M 5 2 C 3.346 2 2 3.346 2 5 L 2 21 C 2 22.654 3.346 24 5 24 L 12 24 L 12 35 C 12 36.64497 13.35503 38 15 38 L 26 38 L 26 45 C 26 46.654 27.346 48 29 48 L 45 48 C 46.654 48 48 46.654 48 45 L 48 29 C 48 27.346 46.654 26 45 26 L 38 26 L 38 15 C 38 13.35503 36.64497 12 35 12 L 24 12 L 24 5 C 24 3.346 22.654 2 21 2 L 5 2 z M 24 14 L 35 14 C 35.56503 14 36 14.43497 36 15 L 36 26 L 29 26 C 27.346 26 26 27.346 26 29 L 26 36 L 15 36 C 14.43497 36 14 35.56503 14 35 L 14 24 L 21 24 C 22.654 24 24 22.654 24 21 L 24 14 z"/>
            </svg>
            <svg onClick={this.props.bringForward} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path d="M 6 3 C 4.3550302 3 3 4.3550302 3 6 L 3 29 C 3 30.64497 4.3550302 32 6 32 L 18 32 L 18 44 C 18 45.654 19.346 47 21 47 L 44 47 C 45.654 47 47 45.654 47 44 L 47 21 C 47 19.346 45.654 18 44 18 L 32 18 L 32 6 C 32 4.3550302 30.64497 3 29 3 L 6 3 z M 6 5 L 29 5 C 29.56503 5 30 5.4349698 30 6 L 30 29 C 30 29.56503 29.56503 30 29 30 L 6 30 C 5.4349698 30 5 29.56503 5 29 L 5 6 C 5 5.4349698 5.4349698 5 6 5 z"/>
            </svg>
            <svg onClick={this.props.sendBackwards} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path d="M 6 3 C 4.3550302 3 3 4.3550302 3 6 L 3 29 C 3 30.64497 4.3550302 32 6 32 L 18 32 L 18 44 C 18 45.654 19.346 47 21 47 L 44 47 C 45.654 47 47 45.654 47 44 L 47 21 C 47 19.346 45.654 18 44 18 L 32 18 L 32 6 C 32 4.3550302 30.64497 3 29 3 L 6 3 z M 6 5 L 29 5 C 29.56503 5 30 5.4349698 30 6 L 30 18 L 21 18 C 19.346 18 18 19.346 18 21 L 18 30 L 6 30 C 5.4349698 30 5 29.56503 5 29 L 5 6 C 5 5.4349698 5.4349698 5 6 5 z"/>
            </svg>
          </div>
          <div className="flip-delete">
            <div className="obj-flip">
              <div className="option-title">Flip</div>
              <div className="flip-button">
                <svg onClick={this.flipObject} flip="X" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                  <path d="M 22.875 5 A 1.0001 1.0001 0 0 0 22.09375 5.5625 L 4.09375 42.5625 A 1.0001 1.0001 0 0 0 5 44 L 23 44 A 1.0001 1.0001 0 0 0 24 43 L 24 6 A 1.0001 1.0001 0 0 0 22.875 5 z M 27.125 5 C 27.014063 4.9872656 26.8955 5.00525 26.78125 5.03125 C 26.32725 5.13625 26 5.534 26 6 L 26 43 C 26 43.553 26.447 44 27 44 L 45 44 C 45.345 44 45.66075 43.82325 45.84375 43.53125 C 46.02675 43.23925 46.05625 42.8725 45.90625 42.5625 L 27.90625 5.5625 C 27.754 5.24825 27.457812 5.0382031 27.125 5 z M 22 10.34375 L 22 42 L 6.59375 42 L 22 10.34375 z" overflow="visible" enable-background="accumulate" font-family="Bitstream Vera Sans"/>
                </svg>
                <svg onClick={this.flipObject} flip="Y"xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                  <path d="M 43.0625 4 C 42.89575 3.991 42.718 4.01875 42.5625 4.09375 L 5.5625 22.09375 C 5.1435 22.29775 4.92725 22.76475 5.03125 23.21875 C 5.13625 23.67175 5.534 24 6 24 L 43 24 C 43.553 24 44 23.552 44 23 L 44 5 C 44 4.655 43.82325 4.33825 43.53125 4.15625 C 43.38575 4.06525 43.22925 4.009 43.0625 4 z M 5.8125 26 A 1.0001 1.0001 0 0 0 5.5625 27.90625 L 42.5625 45.90625 A 1.0001 1.0001 0 0 0 44 45 L 44 27 A 1.0001 1.0001 0 0 0 43 26 L 6 26 A 1.0001 1.0001 0 0 0 5.90625 26 A 1.0001 1.0001 0 0 0 5.8125 26 z M 10.34375 28 L 42 28 L 42 43.40625 L 10.34375 28 z" overflow="visible" enable-background="accumulate" font-family="Bitstream Vera Sans"/>
                </svg>
              </div>
            </div>
            <div className="obj-delete">
              <div className="option-title">Delete</div>
              <div className="delete-button">
                <svg onClick={this.props.deleteObject} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                  <path d="M 5 12 C 3.3 12 2 13.3 2 15 L 2 51 C 2 52.7 3.3 54 5 54 L 38.363281 54 C 39.723281 59.724 44.865 64 51 64 C 58.168 64 64 58.168 64 51 C 64 46.41 61.602 42.3765 58 40.0625 L 58 18 L 58 16 L 58 15 C 58 13.3 56.7 12 55 12 L 5 12 z M 5 14 L 55 14 C 55.6 14 56 14.4 56 15 L 56 39.003906 C 54.46 38.359906 52.771 38 51 38 C 50.807 38 50.620687 38.021297 50.429688 38.029297 L 47.099609 34.699219 C 45.999609 33.599219 44.000391 33.599219 42.900391 34.699219 L 34.5 43.099609 L 31.099609 39.699219 C 29.999609 38.499219 28.100391 38.499219 26.900391 39.699219 L 18.599609 48 L 15.042969 48 C 14.417969 48 14 48.4 14 49 C 14 49.6 14.521969 50 15.042969 50 L 38.050781 50 C 38.024781 50.331 38 50.662 38 51 C 38 51.338 38.024781 51.669 38.050781 52 L 5 52 C 4.4 52 4 51.5 4 51 L 4 15 C 4 14.4 4.4 14 5 14 z M 17 16 C 16.4 16 16 16.447 16 17 L 16 19 C 16 19.552 16.4 20 17 20 C 17.6 20 18 19.553 18 19 L 18 17 C 18 16.447 17.6 16 17 16 z M 11.894531 17.335938 C 11.763656 17.353109 11.63 17.397656 11.5 17.472656 C 10.98 17.772656 10.858766 18.360844 11.134766 18.839844 L 12.134766 20.570312 C 12.321766 20.894313 12.655953 21.072266 13.001953 21.072266 C 13.130953 21.095266 13.327 21.0375 13.5 20.9375 C 14.02 20.6375 14.141234 20.049312 13.865234 19.570312 L 12.865234 17.839844 C 12.658234 17.480594 12.287156 17.284422 11.894531 17.335938 z M 22.107422 17.337891 C 21.714797 17.286375 21.341766 17.480594 21.134766 17.839844 L 20.134766 19.572266 C 19.858766 20.050266 19.982953 20.6375 20.501953 20.9375 C 20.674953 21.0375 20.871 21.097219 21 21.074219 C 21.347 21.074219 21.683188 20.891266 21.867188 20.572266 L 22.867188 18.839844 C 23.143187 18.360844 23.021953 17.774609 22.501953 17.474609 C 22.371953 17.399609 22.238297 17.355062 22.107422 17.337891 z M 8.4648438 21.001953 C 8.0836094 20.944203 7.6976562 21.111953 7.4726562 21.501953 C 7.1726562 22.020953 7.3618437 22.590187 7.8398438 22.867188 L 9.5703125 23.867188 C 9.7293125 23.959187 9.8766875 24.042297 10.054688 24.029297 C 10.414687 24.006297 10.7375 23.847953 10.9375 23.501953 C 11.2375 22.981953 11.049312 22.410766 10.570312 22.134766 L 8.8398438 21.134766 C 8.7200938 21.065766 8.5919219 21.021203 8.4648438 21.001953 z M 25.533203 21.001953 C 25.406125 21.021203 25.279906 21.065766 25.160156 21.134766 L 23.427734 22.134766 C 22.949734 22.410766 22.7625 22.98 23.0625 23.5 C 23.2625 23.846 23.585313 24.006297 23.945312 24.029297 C 24.123313 24.042297 24.267734 23.957234 24.427734 23.865234 L 26.160156 22.865234 C 26.639156 22.589234 26.825391 22.02 26.525391 21.5 C 26.300391 21.11 25.914437 20.944203 25.533203 21.001953 z M 17.074219 22.007812 C 14.322219 22.007812 12.082031 24.248 12.082031 27 C 12.082031 29.752 14.322219 31.992188 17.074219 31.992188 C 19.826219 31.992188 22.066406 29.752 22.066406 27 C 22.066406 24.248 19.826219 22.007812 17.074219 22.007812 z M 17.074219 23.992188 C 18.738219 23.992188 20.082031 25.336 20.082031 27 C 20.082031 28.664 18.738219 30.007812 17.074219 30.007812 C 15.410219 30.007812 14.066406 28.664 14.066406 27 C 14.066406 25.336 15.410219 23.992188 17.074219 23.992188 z M 7 26 C 6.448 26 6 26.4 6 27 C 6 27.6 6.447 28 7 28 L 9 28 C 9.553 28 10 27.6 10 27 C 10 26.4 9.553 26 9 26 L 7 26 z M 25 26 C 24.447 26 24 26.4 24 27 C 24 27.6 24.448 28 25 28 L 27 28 C 27.553 28 28 27.6 28 27 C 28 26.4 27.553 26 27 26 L 25 26 z M 9.9453125 30.001953 C 9.818375 30.021203 9.6917656 30.065766 9.5722656 30.134766 L 7.8398438 31.134766 C 7.3608438 31.410766 7.1726562 31.98 7.4726562 32.5 C 7.6726563 32.846 7.9954687 33.006297 8.3554688 33.029297 C 8.5324687 33.042297 8.6798437 32.957234 8.8398438 32.865234 L 10.570312 31.865234 C 11.049312 31.589234 11.2375 31.02 10.9375 30.5 C 10.7125 30.11 10.326125 29.944203 9.9453125 30.001953 z M 24.054688 30.001953 C 23.673453 29.944203 23.2875 30.11 23.0625 30.5 C 22.7625 31.02 22.948734 31.589234 23.427734 31.865234 L 25.160156 32.865234 C 25.320156 32.957234 25.464578 33.042297 25.642578 33.029297 C 26.002578 33.006297 26.325391 32.846 26.525391 32.5 C 26.825391 31.981 26.639156 31.411766 26.160156 31.134766 L 24.427734 30.134766 C 24.307984 30.065766 24.181766 30.021203 24.054688 30.001953 z M 13.105469 32.925781 C 12.712844 32.874266 12.341766 33.068484 12.134766 33.427734 L 11.134766 35.160156 C 10.858766 35.639156 10.98 36.225391 11.5 36.525391 C 11.673 36.625391 11.869047 36.685109 11.998047 36.662109 C 12.345047 36.662109 12.681234 36.479156 12.865234 36.160156 L 13.865234 34.427734 C 14.142234 33.949734 14.02 33.3625 13.5 33.0625 C 13.37 32.9875 13.236344 32.942953 13.105469 32.925781 z M 20.894531 32.925781 C 20.763656 32.942953 20.63 32.9875 20.5 33.0625 C 19.98 33.3625 19.858766 33.948734 20.134766 34.427734 L 21.134766 36.160156 C 21.321766 36.484156 21.655953 36.662109 22.001953 36.662109 C 22.130953 36.685109 22.327 36.625391 22.5 36.525391 C 23.02 36.225391 23.141234 35.639156 22.865234 35.160156 L 21.865234 33.427734 C 21.658234 33.068484 21.287156 32.874266 20.894531 32.925781 z M 17 34 C 16.4 34 16 34.447 16 35 L 16 37 C 16 37.553 16.4 38 17 38 C 17.6 38 18 37.553 18 37 L 18 35 C 18 34.447 17.6 34 17 34 z M 45 35.800781 C 45.25 35.800781 45.499219 35.899609 45.699219 36.099609 L 47.970703 38.371094 C 43.224703 39.510094 39.491281 43.25 38.363281 48 L 32.400391 48 L 44.300781 36.099609 C 44.500781 35.899609 44.75 35.800781 45 35.800781 z M 51 40 C 57.065 40 62 44.935 62 51 C 62 57.065 57.065 62 51 62 C 44.935 62 40 57.065 40 51 C 40 44.935 44.935 40 51 40 z M 29 40.800781 C 29.25 40.800781 29.499219 40.899609 29.699219 41.099609 L 33.099609 44.5 L 29.599609 48 L 21.400391 48 L 28.300781 41.099609 C 28.500781 40.899609 28.75 40.800781 29 40.800781 z M 46.755859 45.755859 C 46.499984 45.755859 46.245781 45.855281 46.050781 46.050781 C 45.659781 46.441781 45.659781 47.074844 46.050781 47.464844 L 49.585938 51 L 46.050781 54.535156 C 45.659781 54.926156 45.659781 55.559219 46.050781 55.949219 C 46.440781 56.340219 47.074844 56.340219 47.464844 55.949219 L 51 52.414062 L 54.535156 55.949219 C 54.926156 56.340219 55.559219 56.340219 55.949219 55.949219 C 56.340219 55.559219 56.340219 54.925156 55.949219 54.535156 L 52.414062 51 L 55.949219 47.464844 C 56.339219 47.074844 56.339219 46.441781 55.949219 46.050781 C 55.559219 45.659781 54.925156 45.659781 54.535156 46.050781 L 51 49.585938 L 47.464844 46.050781 C 47.269344 45.855281 47.011734 45.755859 46.755859 45.755859 z M 7 48 C 6.4 48 6 48.4 6 49 C 6 49.6 6.4 50 7 50 L 11 50 C 11.6 50 12 49.6 12 49 C 12 48.4 11.6 48 11 48 L 7 48 z"/>
                </svg>
                <svg onClick={this.props.deleteAllObject} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                  <path d="M 28.070312 2 C 27.065313 2 26.132219 2.4999375 25.574219 3.3359375 L 22.464844 8 L 11 8 C 9.346 8 8 9.346 8 11 L 8 17 C 8 18.654 9.346 20 11 20 L 11.099609 20 L 14.628906 53.523438 C 14.895906 56.076437 17.034563 58 19.601562 58 L 44.400391 58 C 46.966391 58 49.103094 56.076438 49.371094 53.523438 L 52.900391 20 L 53 20 C 54.654 20 56 18.654 56 17 L 56 11 C 56 9.346 54.654 8 53 8 L 41.535156 8 L 38.425781 3.3359375 C 37.867781 2.4999375 36.934688 2 35.929688 2 L 28.070312 2 z M 28.070312 4 L 35.929688 4 C 36.264688 4 36.575719 4.1673125 36.761719 4.4453125 L 39.132812 8 L 24.867188 8 L 27.238281 4.4453125 C 27.424281 4.1673125 27.735312 4 28.070312 4 z M 11 10 L 21.132812 10 L 42.867188 10 L 53 10 C 53.552 10 54 10.449 54 11 L 54 17 C 54 17.551 53.552 18 53 18 L 52 18 L 12 18 C 11.978 18 11.9595 18.011672 11.9375 18.013672 C 11.9165 18.011672 11.897 18 11.875 18 L 11 18 C 10.448 18 10 17.551 10 17 L 10 11 C 10 10.449 10.448 10 11 10 z M 14 12 C 13.447 12 13 12.448 13 13 L 13 15 C 13 15.552 13.447 16 14 16 C 14.553 16 15 15.552 15 15 L 15 13 C 15 12.448 14.553 12 14 12 z M 19 12 C 18.447 12 18 12.448 18 13 L 18 15 C 18 15.552 18.447 16 19 16 C 19.553 16 20 15.552 20 15 L 20 13 C 20 12.448 19.553 12 19 12 z M 24 12 C 23.447 12 23 12.448 23 13 L 23 15 C 23 15.552 23.447 16 24 16 C 24.553 16 25 15.552 25 15 L 25 13 C 25 12.448 24.553 12 24 12 z M 29 12 C 28.447 12 28 12.448 28 13 L 28 15 C 28 15.552 28.447 16 29 16 C 29.553 16 30 15.552 30 15 L 30 13 C 30 12.448 29.553 12 29 12 z M 35 12 C 34.447 12 34 12.448 34 13 L 34 15 C 34 15.552 34.447 16 35 16 C 35.553 16 36 15.552 36 15 L 36 13 C 36 12.448 35.553 12 35 12 z M 40 12 C 39.447 12 39 12.448 39 13 L 39 15 C 39 15.552 39.447 16 40 16 C 40.553 16 41 15.552 41 15 L 41 13 C 41 12.448 40.553 12 40 12 z M 45 12 C 44.447 12 44 12.448 44 13 L 44 15 C 44 15.552 44.447 16 45 16 C 45.553 16 46 15.552 46 15 L 46 13 C 46 12.448 45.553 12 45 12 z M 50 12 C 49.447 12 49 12.448 49 13 L 49 15 C 49 15.552 49.447 16 50 16 C 50.553 16 51 15.552 51 15 L 51 13 C 51 12.448 50.553 12 50 12 z M 13.109375 20 L 50.890625 20 L 47.382812 53.314453 C 47.221812 54.846453 45.938437 56 44.398438 56 L 19.601562 56 C 18.061563 56 16.778187 54.846453 16.617188 53.314453 L 13.109375 20 z M 23.515625 25 C 23.259875 25 23.004094 25.097469 22.808594 25.292969 C 22.417594 25.683969 22.417594 26.316031 22.808594 26.707031 L 30.585938 34.484375 L 22.808594 42.263672 C 22.417594 42.654672 22.417594 43.286734 22.808594 43.677734 C 23.003594 43.872734 23.259625 43.970703 23.515625 43.970703 C 23.771625 43.970703 24.027656 43.872734 24.222656 43.677734 L 32 35.898438 L 39.777344 43.677734 C 39.972344 43.872734 40.228375 43.970703 40.484375 43.970703 C 40.740375 43.970703 40.996406 43.872734 41.191406 43.677734 C 41.582406 43.286734 41.582406 42.654672 41.191406 42.263672 L 33.414062 34.484375 L 41.191406 26.707031 C 41.582406 26.316031 41.582406 25.683969 41.191406 25.292969 C 40.800406 24.901969 40.168344 24.901969 39.777344 25.292969 L 32 33.070312 L 24.222656 25.292969 C 24.027156 25.097469 23.771375 25 23.515625 25 z M 21 52 C 20.447 52 20 52.448 20 53 C 20 53.552 20.447 54 21 54 L 35 54 C 35.553 54 36 53.552 36 53 C 36 52.448 35.553 52 35 52 L 21 52 z M 39 52 C 38.447 52 38 52.448 38 53 C 38 53.552 38.447 54 39 54 L 43 54 C 43.553 54 44 53.552 44 53 C 44 52.448 43.553 52 43 52 L 39 52 z"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="option-title">Group</div>
          <div className="obj-group">
            <svg onClick={this.props.makeGroup}> xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path d="M 3 3 L 3 4 L 3 11 L 6 11 L 6 39 L 3 39 L 3 47 L 11 47 L 11 46 L 11 44 L 39 44 L 39 47 L 47 47 L 47 46 L 47 39 L 44 39 L 44 11 L 47 11 L 47 10 L 47 3 L 39 3 L 39 6 L 11 6 L 11 3 L 3 3 z M 5 5 L 9 5 L 9 9 L 5 9 L 5 5 z M 41 5 L 45 5 L 45 9 L 43 9 L 41 9 L 41 7 L 41 5 z M 11 8 L 39 8 L 39 11 L 42 11 L 42 39 L 39 39 L 39 42 L 11 42 L 11 39 L 8 39 L 8 11 L 11 11 L 11 8 z M 13 13 L 13 14 L 13 29 L 21 29 L 21 37 L 37 37 L 37 21 L 29 21 L 29 13 L 13 13 z M 15 15 L 27 15 L 27 27 L 15 27 L 15 15 z M 29 23 L 35 23 L 35 35 L 23 35 L 23 29 L 29 29 L 29 23 z M 5 41 L 7 41 L 9 41 L 9 43 L 9 45 L 5 45 L 5 41 z M 41 41 L 43 41 L 45 41 L 45 45 L 41 45 L 41 43 L 41 41 z"/>
            </svg>
            <svg onClick={this.props.unGroup}> xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path d="M 6 6 L 6 12 L 8 12 L 8 29 L 6 29 L 6 35 L 12 35 L 12 33 L 17 33 L 17 38 L 15 38 L 15 44 L 21 44 L 21 42 L 38 42 L 38 44 L 44 44 L 44 38 L 42 38 L 42 21 L 44 21 L 44 15 L 38 15 L 38 17 L 33 17 L 33 12 L 35 12 L 35 6 L 29 6 L 29 8 L 12 8 L 12 6 L 6 6 z M 8 8 L 10 8 L 10 10 L 8 10 L 8 8 z M 31 8 L 33 8 L 33 10 L 31 10 L 31 8 z M 12 10 L 29 10 L 29 12 L 31 12 L 31 29 L 29 29 L 29 31 L 12 31 L 12 29 L 10 29 L 10 12 L 12 12 L 12 10 z M 40 17 L 42 17 L 42 19 L 40 19 L 40 17 z M 33 19 L 38 19 L 38 21 L 40 21 L 40 38 L 38 38 L 38 40 L 21 40 L 21 38 L 19 38 L 19 33 L 29 33 L 29 35 L 35 35 L 35 29 L 33 29 L 33 19 z M 8 31 L 10 31 L 10 33 L 8 33 L 8 31 z M 31 31 L 33 31 L 33 33 L 31 33 L 31 31 z M 17 40 L 19 40 L 19 42 L 17 42 L 17 40 z M 40 40 L 42 40 L 42 42 L 40 42 L 40 40 z"/>
            </svg>
          </div>
          <div className="option-title">Zoom</div>
          <div className="obj-zoom">
            <div className="zoom-box">
              <div className="keep-ratio">
                <label class="mycheckbox path">
                  <input type="checkbox" id="lockScale" onClick={this.props.lockScaleRatio} disabled = {this.props.object.type === 'not active' || this.props.object.type === 'path' ? true : false}/>
                  <svg viewBox="0 0 21 21">
                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                  </svg>
                </label> 
                <div>비율 유지</div>
              </div>
              <input
                type='range'
                name='scaleX'
                min='1'
                max='200'
                step='1'
                disabled = {this.props.object.type === 'not active' || this.props.object.type === 'path' ? true : false}
                value={this.props.object.scaleX * 100}
                onChange={this.handleScaleXChange}
              />
              <label>{this.props.object.scaleX * 100}%</label>
              <input
                type='range'
                name='scaleY'
                min='1'
                max='200'
                step='1'
                disabled = {this.props.object.type === 'not active' || this.props.object.type === 'path' ? true : false}
                value={this.props.object.scaleY * 100}
                onChange={this.handleScaleYChange}
              />
              <label>{this.props.object.scaleY * 100}%</label>
            </div>
          </div>
        </div>
      </div>
    );
  }

}