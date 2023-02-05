import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectList } from 'react-native-dropdown-select-list';
import { setDetails } from '../redux/action';
import { data } from './countryData'
import { brand } from './brand';
import { Countries } from './Countries';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert,
  ScrollView,
  TouchableOpacity, 
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';


export default function Detailform({navigation}) {
    const { details, detailID } = useSelector(state => state.detailReducer);
    const dispatch = useDispatch();
    const defaultCodeCountry ='+977'
    const defaultMaskCountry = '98 1358 7738'
    const [codeCountry, setCodeCountry] = useState(defaultCodeCountry)
    const [placeholder, setPlaceHolder] = useState(defaultMaskCountry)

    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [phoneBrand, setPhoneBrand] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dataCountries, setDataCountries] = useState(Countries);
    const [error, setError] = useState("");

    const [modalVisible, setModalVisible] = useState(false)
    const onShowHideModal = () => {
        setModalVisible(!modalVisible)
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            getDetail();
        });
    }, [])

    const getDetail = () => {
        const Detail = details.find(detail => detail.ID === detailID)
        if (Detail) {
            setName(Detail.Name);
            setCountry(Detail.Country);
            setPhoneBrand(Detail.PhoneBrand);
            setPhoneNumber(Detail.PhoneNumber);
        }
    }

    const setDetail = () => {
        if (!name || !country || !phoneBrand || !phoneNumber) {
            setError("All fields are required");
            return;
          }
        else if (!/^\d{10}$/.test(phoneNumber)) {
            setError("Phone number must be 10 digits");
            return;
        } 
        else {
            try {
                var Detail = {
                    ID: detailID,
                    Name: name,
                    Country: country,
                    PhoneBrand: phoneBrand,
                    PhoneNumber: phoneNumber,
                }
                const index = details.findIndex(detail => detail.ID === detailID);
                let newDetails = [];
                if (index > -1) {
                    newDetails = [...details];
                    newDetails[index] = Detail;
                } else {
                    newDetails = [...details, Detail];
                }
                AsyncStorage.setItem('Details', JSON.stringify(newDetails))
                    .then(() => {
                        dispatch(setDetails(newDetails));
                        Alert.alert('Success!', 'Detail saved successfully.');
                        navigation.goBack();
                    })
                    .catch(err => console.log(err))
            } catch (error) {
                console.log(error);
            }
        }
    }
    const filterCountries = (value)=>{
        if(value){
            const countryData = dataCountries.filter((obj)=>
            (obj.en.indexOf(value)>-1||obj.dialCode.indexOf(value)>-1))
            setDataCountries(countryData)
        } else{
            setDataCountries(Countries)
        }
    }

    const onCountryChange = (item)=>{
        setCodeCountry(item.dialCode)
        setPlaceHolder(item.mask)
        onShowHideModal
    }

    let renderModal = () => {
        return(
            <Modal animationType='slide' transparent={false} visible={modalVisible}>
                <SafeAreaView style = {{flex:1}}>
                    <View style={styles.ModalContainer}>
                        <View style={styles.filterInputContainer}>
                            <TextInput 
                                autoFocus={true}
                                onChangeText={filterCountries}
                                placeholder={'Filter'}
                                focusable={true}
                                style={styles.filterInputStyle}
                            />
                        </View>
                        
                        <FlatList
                            style = {{flex:1}}
                            data={dataCountries}
                            extraData={dataCountries}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={
                                ({item}) => (
                                    <TouchableWithoutFeedback onPress={()=>onCountryChange(item)}>
                                        <View style={styles.countryModalStyle}>
                                            <View style = {styles.modalItemContainer}>
                                                <Text style = {styles.modalItemName}>{item.en}</Text>
                                                <Text style = {styles.modalItemDialCode}>{item.dialCode}</Text>
                                            </View>
                                        </View>

                                    </TouchableWithoutFeedback>
                                )
                            }
                    />
                    </View>

                    <TouchableOpacity onPress={onShowHideModal} style={styles.closeBottonStyle}>
                        <Text style={styles.closeTextStyle}>{'Close'}</Text>
                    </TouchableOpacity>

                </SafeAreaView>

            </Modal>
        )
    }
    return(
        <ScrollView>
            <View style = {styles.detform}>
            <View style = {styles.container}>
                <TouchableOpacity
                    style={styles.back}
                    onPress={() => {
                        navigation.navigate('All Details');
                    }}
                >
                    <FontAwesome5
                        name={'arrow-left'}
                        size={20}
                        color={'#ffffff'}
                    />
                </TouchableOpacity>

                <Text style= {styles.header}>Details</Text>
                <TextInput 
                    value={name}
                    style={styles.textinput}
                    placeholder = 'Your Name' 
                    underlineColorAndroid={'transparent'}
                    onChangeText={(value)=>setName(value)}
                />
                <View style = {styles.select}>
                <SelectList
                    data = {data}
                    setSelected={setCountry} 
                    placeholder = "Select Country"         
                />
                </View>
                <View style = {styles.select}>
                <SelectList
                    data = {brand}
                    setSelected={setPhoneBrand} 
                    placeholder = "Select Phone Brand"        
                />
                </View>
                
                <View style = {styles.phoneInput}>
                    <TouchableOpacity onPress={onShowHideModal}>
                        <View style = {styles.openDialogView}>
                            <Text>{codeCountry + '|'}</Text>
                        </View>
                    </TouchableOpacity>
                    {renderModal()}
                    <TextInput  
                        value={phoneNumber}    
                        style={styles.phoneInputStyles} 
                        placeholder = {placeholder}
                        keyboardType = 'phone-pad'
                        onChangeText={(value)=>setPhoneNumber(value)}
                    />
                </View>
                {error && <Text style={styles.error}>{error}</Text>}
                <TouchableHighlight 
                    style = {styles.button}
                    onPress = {setDetail}
                >
                    <Text style = {styles.btntxt}>Submit</Text>
                </TouchableHighlight>  
            </View>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    detform: {
        backgroundColor: '#cfcfcf',
        paddingBottom: 150,
        paddingTop: 110,
    },
    container:{
        paddingRight:10,
        paddingLeft:10,
        paddingTop:10,
    },
    header:{
        fontSize: 34,
        color:'#fff',
        paddingBottom: 10,
        marginBottom: 40,
        borderBottomColor: '#199187',
        borderBottomWidth: 1,
        paddingLeft: 10,
    },
    textinput:{
        alignSelf: 'stretch',
        height: 40,
        marginBottom: 30,
        marginLeft: 7,
        color: '#fff',
        borderBottomColor: '#f8f8f8',
        borderBottomWidth: 1,
        fontSize: 15,
    },
    button:{
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#99BE9E',
        marginTop: 20,
    },
    btntxt:{
        color: '#fff',
        fontWeight: 'bold',
    },
    select:{
        marginTop: 10,
        marginBottom: 20,
    },
    back: {
        width: 80,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#99BE9E',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -70,
        left: 15,
        elevation: 5,
    },
    phoneInput:{
        flexDirection: 'row',
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1.5,
    },
    openDialogView:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    phoneInputStyles:{
        marginLeft: 5,
        flex:1,
        height:50,
    },
    ModalContainer:{
        paddingTop: 15,
        paddingLeft: 25,
        paddingRight: 25,
        flex: 1,
        backgroundColor: '#fff'
    },
    filterInputStyle:{
        flex:1,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor: '#fff',
        color: '#424242'
    },
    countryModalStyle:{
        flex:1,
        borderColor: '#000',
        borderTopWidth: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalItemContainer:{
        flex:1,
        paddingLeft:5,
        flexDirection: 'row'
    },
    modalItemName:{
        flex:1,
        fontSize: 16
    },
    modalItemDialCode:{
        fontSize:16
    },
    filterInputContainer:{
        width:'100%',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeBottonStyle:{
        padding:12,
        alignItems:'center'
    },
    closeTextStyle:{
        padding:5,
        fontSize:20,
        color:'#000',
        fontWeight: 'bold'
    },
    error:{
        color: '#ff0000'
    },
});