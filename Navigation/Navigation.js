import {createStackNavigator, createAppContainer} from 'react-navigation'
import Search from '../Components/Search.js'
import FilmDetail from '../Components/FilmDetail.js'


const SearchStackNavigator = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Search'
    }
  },
  FilmDetail:{
    screen: FilmDetail,
  }
})



export default createAppContainer(SearchStackNavigator)
