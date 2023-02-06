import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { setDetails, setDetailID } from '../redux/action';
import { SelectList } from 'react-native-dropdown-select-list';
import { data } from './countryData'
import { brand } from './brand';

export default function AllDetails({navigation}) { 
  const {details} = useSelector(state => state.detailReducer)
  const dispatch = useDispatch();
  useEffect(() => {
    getDetails();
    filterData();
  }, [])

  
  const getDetails = () => {
    AsyncStorage.getItem('details')
        .then(details => {
            const parsedDetails = JSON.parse(details);
            if (parsedDetails && typeof parsedDetails === 'object') {
                dispatch(setDetails(parsedDetails));
            }
        })
        .catch(err => console.log(err))
  }

  const [isCountry, setFilter] = useState(true)
  const [isClicked, setClick] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [filteredData, setFilteredData] = useState(details);

  const filterData = () => {
    let filtered = details;

    if (selectedCountry) {
      filtered = filtered.filter(item => item.Country === selectedCountry);
      setFilteredData(filtered);
    }

    else if (selectedBrand) {
      filtered = filtered.filter(item => item.PhoneBrand === selectedBrand);
      setFilteredData(filtered);
    }
    else{
        setFilteredData(details);
    }
  };

  return (
    <View style={styles.body}>
        <View style={styles.search}>
            <View style = {{marginRight:60}}>
                {isCountry?(
                    <SelectList
                        data = {data}
                        placeholder = "Select Country"
                        setSelected={setSelectedCountry}
                        onSelect = {filterData}
                    />
                ):(
                    <SelectList
                        data = {brand}
                        placeholder = "Select Brand"  
                        setSelected={setSelectedBrand}  
                        onSelect = {filterData}     
                    />
                )}
                
            </View>
            <View style={styles.filter}>
                <TouchableOpacity
                    onPress={() => {
                        setClick(!isClicked);
                    }}
                >
                    <Ionicons
                        name={'filter-sharp'}
                        size={20}
                        color={'#ffffff'}
                    />     
                </TouchableOpacity>
            </View>
            {isClicked?(
                <View style = {styles.dropdownArea}>
                    <TouchableOpacity 
                    style= {styles.filter_content} 
                    onPress = {()=>{
                        setFilter(true);
                        setClick(false);
                    }}>
                        <Text style = {styles.filter_text}>Country</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style= {styles.filter_content} 
                    onPress = {()=>{
                        setFilter(false);
                        setClick(false);
                    }}
                    >
                        <Text style = {styles.filter_text}>Brand</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress = {()=>{
                        setClick(false);
                        setFilteredData(details);
                        setSelectedBrand("");
                        setSelectedCountry("");
                    }}
                    >
                        <Text style = {styles.filter_text}>Reset</Text>
                    </TouchableOpacity>
                    </View>
            ):null}
        </View>
        <View style={styles.header}>
            <View style={styles.header_item}>
                <Text style={styles.header_text}>Name</Text>
            </View>
            <View style={styles.header_item}>
                <Text style={styles.header_text} >Country</Text>
            </View>
            <View style={styles.header_item}>
                <Text style={styles.header_text}>Brand</Text>
            </View>
            <View style={styles.header_item}>
                <Text style={styles.header_text}>Number</Text>
            </View>
        </View>
        
        <FlatList
            data = {filteredData}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        dispatch(setDetailID(item.ID));
                        navigation.navigate('DetailForm');
                    }}
                >
                    <View style={styles.item_row}>
                        <View
                            style={[
                                {
                                    backgroundColor:
                                        item.Color ===  '#f28b82' 
                                },
                                styles.color]}
                        />
                        <View style={styles.item_body}>
                            <Text
                                style={[
                                    styles.item_text
                                ]}
                                numberOfLines={1}
                            >
                                {item.Name}
                            </Text>
                        </View>
                        <View style={styles.item_body}>    
                            <Text
                                style={[
                                    styles.item_text
                                ]}
                                numberOfLines={1}
                            >
                                {item.Country}
                            </Text>
                        </View>
                        <View style={styles.item_body}>  
                            <Text
                                style={[
                                    styles.item_text
                                ]}
                                numberOfLines={1}
                            >
                                {item.PhoneBrand}
                            </Text>
                        </View>
                        <View style={styles.item_body}>  
                            <Text
                                style={[
                                    styles.item_text
                                ]}
                                numberOfLines={1}
                            >
                                {item.PhoneNumber}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
                dispatch(setDetailID(details.length + 1));
                navigation.navigate('DetailForm');
            }}
        >
            <FontAwesome5
                name={'plus'}
                size={25}
                color={'#ffffff'}
            />
        </TouchableOpacity>
    </View>
)
}

const styles = StyleSheet.create({
body: {
    flex: 1,
    backgroundColor: '#cfcfcf',
},
button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#99BE9E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25,
    right: 25,
    elevation: 5,
},
filter: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#99BE9E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    left: 310,
    elevation: 5,
},
filter_content:{
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#a0a0a0'
},
filter_text:{
    marginHorizontal:7,
    marginVertical: 5,
    fontWeight: 'bold',
},
header:{
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 10,
    paddingRight: 10,
    backgroundColor: '#E9E9E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 15,    
    height: 50,
    
},
header_item:{
    flex: 1,
},
header_text:{
    color: '#1F1F1F',
    fontSize: 15,
    marginLeft: 20,
    margin: 5,  
    fontWeight:'bold',
    
},
item_row: {
    flexDirection: 'row',
    alignItems: 'center',
},
item_body: {
    flex: 1,
},
item: {
    marginHorizontal: 10,
    marginVertical: 3,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
    
},
item_text: {
    fontSize: 15,
    margin: 5,
    borderRightWidth:1,
    borderRightColor: '#E0E0E0'
},
search:{
    margin: 25,
    borderWidth: 1,
    borderColor: '#999980',
    padding:15,

},
color: {
    width: 20,
    height: 50,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
},
dropdownArea:{
    width: 100,
    left:260, 
    backgroundColor: '#fff',
    elevation: 5,
    alignItems: 'center',
},
})