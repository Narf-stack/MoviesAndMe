import React from 'react'
import {StyleSheet, View, Button, TextInput, FlatList, Text, ActivityIndicator} from 'react-native'
//import films from '../Helpers/filmsData.js'
import FilmItem from './FilmItem.js'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'


class Search extends React.Component{

  constructor(props) {
    super(props)
    this.page = 0;
    this.totalPages = 0;
    this.state = {
      searchedText: "",
      films: [],
      isLoading: false
    }
  }


  _searchTextInputChanged(text) {
    this.setState({ searchedText: text })
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  _loadFilms() {
    console.log(this.state.searchedText)
    if (this.state.searchedText.length > 0) {

      this.setState({isLoading:true})

      getFilmsFromApiWithSearchedText(this.state.searchedText, this.page+1).then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
        this.setState({
          films: [ ...this.state.films, ...data.results ],
          isLoading: false
         })
      })
    }
  }

  _searchFilms() {
    this.page = 0
      this.totalPages = 0
      this.setState({
        films: []
      }, () => {
        console.log("Page : " + this.page + " / TotalPages : " + this.totalPages +
          " / Nombre de films : " + this.state.films.length)
        this._loadFilms()
    })
  }


  render(){
    return(
      <View style={styles.main_container}>
        <TextInput style={styles.textinput} placeholder="Movie's name"
        onChangeText={(text) => this._searchTextInputChanged(text)}
        onSubmitEditing={() => this._searchFilms()}
        />
        <Button style={{height:50}} title= "Search" onPress={() =>{
          this._searchFilms();
        }
        }/>
        <FlatList
          data={this.state.films}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => <FilmItem film={item}/>}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (this.page < this.totalPages) {
              this._loadFilms()
            }
          }}
        />
        {this._displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create ({
  main_container:{
    marginTop:30,
    flex:1
  },
  textinput:{
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  },
  loading_container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 100,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
})
export default Search;
