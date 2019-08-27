
import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image,ImageBackground, Button, TouchableOpacity } from 'react-native'
import {getFilmDetailFromApi} from '../API/TMDBApi.js'
import { getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      film: undefined,
      isLoading:true
    }
  }
  componentDidMount(){
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data=>{
      this.setState({
        film: data,
        isLoading: false
      })

      //console.log(this.state.isLoading)
    })
  }
  _displayLoading() {
    if (this.state.isLoading) {
      return(
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
          <Text> Órale loco, es is loading !!</Text>
        </View>
      )
    }
  }
  _toggleFavorite(){
    const action = {type: "TOGGLE_FAVORITE", value: this.state.film}
    this.props.dispatch(action)
  }
  _displayFilm() {
    //console.log("film object en dehors");
    // console.log(this.state.film);
    if (this.state.film != undefined) {

      return (
        // console.log("film object en dedans"),
         //console.log(this.state.film),
        <ScrollView style={styles.scrollview_container}>
          <View style={styles.header_container}>
            <Text style={styles.filmTitle}>{this.state.film.title}</Text>
            <Text style={styles.filmReleased}>({moment(new Date(this.state.film.release_date)).format('DD/MM/YYYY')})</Text>
            </View>
            <TouchableOpacity
                style={styles.favorite_container}
                onPress={() => this._toggleFavorite()}>
                {this._displayFavoriteImage()}
            </TouchableOpacity>
          <View style={styles.content_container}>
            <Image
            style={styles.image}
            source={{uri: getImageFromApi(this.state.film.poster_path)}}
          />
            <View>
              <Text style={styles.overview}>{this.state.film.overview}</Text>
              <Text>Note :{this.state.film.vote_average}/ 10</Text>
            </View>
          </View>


           <Text style={styles.default_text}>Nombre de votes : {this.state.film.vote_count}</Text>
           <Text style={styles.default_text}>Budget : {numeral(this.state.film.budget).format('0,0[.]00 $')}</Text>
           <Text style={styles.default_text}>Genre(s) : {this.state.film.genres.map(function(genre){
               return genre.name;
             }).join(" / ")}
           </Text>
           <Text style={styles.default_text}>Companie(s) : {this.state.film.production_companies.map(function(company){
               return company.name;
             }).join(" / ")}
           </Text>
        </ScrollView>
      )
    }
  }


  _displayFavoriteImage() {
      var sourceImage = require('../Images/ic_favorite_border.png')
      if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
        // Film dans nos favoris
        sourceImage = require('../Images/ic_favorite.png')
      }
      return (
        <Image
          style={styles.favorite_image}
          source={sourceImage}
        />
      )
  }

  componentDidUpdate(){
    //console.log("componentDidUpdate : ")
    //console.log(this.props.favoritesFilm)
  }

  render() {
    //console.log(this.props)
    // console.log("Component FilmDetail rendu")
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}


const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header_container: {
    flex: 1,
    flexDirection:'row'
    //alignContent:'space-between'
  },
  filmTitle: {
    flex: 1,
    //flexWrap: 'wrap',
    fontWeight: 'bold',
    fontSize: 28,
    color: '#feb474'
    //paddingBottom: 6,
  },
  filmReleased:{
    color:'#feb474'
  },
  image: {
    //width: 120,
    height: 169,
    //margin: 5,
    //borderRadius: 5,
    resizeMode: 'cover',
    marginBottom: 20
  },
  content_container: {
    flex: 1,
    margin: 5
  },
  overview:{
    fontStyle: 'italic',
    color: 'black',
    margin: 5,
    //marginTop: 15,
    marginBottom: 15
  },

  description_text: {
    fontStyle: 'italic',
    color: 'black',
    margin: 5,
    marginBottom: 15
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    color: 'black'
  },
  favorite_container: {
    alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
  },
  favorite_image: {
    width: 40,
    height: 40
  }
})

export default connect(mapStateToProps,mapDispatchToProps)(FilmDetail)
