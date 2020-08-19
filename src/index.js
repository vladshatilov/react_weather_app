import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import Geolocation from '@react-native-community/geolocation';
// ReactDOM.render(
//	 <React.StrictMode>
//		 <App />
//	 </React.StrictMode>,
//	 document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


class App extends React.Component {
	
	constructor(props){
		super(props)
		this.state = {
			'weather': {},
			'units': 'C',
		}
		Geolocation.getCurrentPosition(info => console.log(info));
	}
	
	componentDidMount(){		
		// navigator.geolocation = require('@react-native-community/geolocation');
		this.getLocationAndWeather();
	}
	
	getLocationAndWeather() {
		if ("geolocation" in navigator) {			
			navigator.geolocation.getCurrentPosition( (position) => {
				let latitude = position.coords.latitude
				let longitude = position.coords.longitude
				let units = (this.state.units == "C"
										 ? "si"
										 : "us")
				let location = latitude + "," + longitude + "?units=" + units
				// https://api.darksky.net/forecast/04c3762b193aaee40affb899992cef3e/55.7522,37.6156

				// require('es6-promise').polyfill();
				let fetchJsonp = require("fetch-jsonp");
				let url = "https://api.darksky.net/forecast/04c3762b193aaee40affb899992cef3e/" + location
				fetchJsonp(url).then( (response) => response.json().then( (json) => this.setState({weather: json}) ) )
			})
		}
	}
	
	onDegClick(){
		this.state.units == 'C'
			? this.setState({units: 'F'})
			: this.setState({units: 'C'});
		this.getLocationAndWeather();
		console.log('Clicked!');


		// https://robwu.nl/cors-anywhere.html
		// https://cors-anywhere.herokuapp.com/
		// https://github.com/Rob--W/cors-anywhere/#documentation

		// https://cloud.yandex.ru/docs/translate/api-ref/Translation/translate#responses

		// https://cloud.yandex.ru/docs/cli/quickstart#install
		// https://cloud.yandex.ru/docs/iam/operations/iam-token/create

	// 	fetch('https://cors-anywhere.herokuapp.com/translate.api.cloud.yandex.net/translate/v2/translate', {
	// 	method: 'POST',
		// body: JSON.stringify({
		// 	"sourceLanguageCode": "en",
		// 	"targetLanguageCode": "ru",
		// 	"format": "PLAIN_TEXT",
		// 	"texts": [
		// 		"string"
		// 	],
			
			
		// }),
		
	// 	})
	// 	.then(response => response.json())
	// 	.then(json => console.log(json))
	}
	
	render(){
		
		let title = 'Weather App'
		let subtitle = 'The weather outside the window:'
		
		let icon = this.state.weather.currently && this.state.weather.currently.icon
			? "wi wi-large wi-forecast-io-" + this.state.weather.currently.icon
			: ''
		
		let deg = this.state.weather.currently && this.state.weather.currently.apparentTemperature 
			? Math.round(this.state.weather.currently.apparentTemperature)
			: ''
		
		let summary = this.state.weather.currently && this.state.weather.currently.summary
			? this.state.weather.currently.summary
			: ''
		
		return (
			<div className='app'>
				<div className='title'>{title}</div>
				<div className='subtitle'><i>{subtitle}</i></div>
				<div className='infopanel'>
					<i className={icon} />
					<div className='flex-row pointer ' onClick={this.onDegClick.bind(this)}>
						{deg}°{this.state.units}
					</div> 
					<div className='summary'>{summary}</div>
				</div>
			</div>		
		)
		
	}	
	
}










class Footer extends React.Component {
	render(){ 
		let footerText = 'Created by '
		return <div className='footer-content'>
			{footerText}
			<a href='https://www.facebook.com/profile.php?id=100010489203947' target='_blank'> Andrey Nikanorov</a>
		</div>
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));
// React.render(<Footer/>, document.getElementById('footer'));
