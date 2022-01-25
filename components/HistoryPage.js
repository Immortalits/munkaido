import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import SvgXml from 'react-native-svg';

import trashIcon from '../assets/Trash_font_awesome';
import { getHistory, deleteHistoryById } from '../database';

export default function HistoryPage(props) {
  const [history, setHistory] = useState([]);

  const deleteItem = () => {
    deleteHistoryById(props.userData.email, 0);

    const newArray = history.splice(0, 1);
    setHistory(newArray);
  };

  const createTwoButtonAlert = () => {
    Alert.alert('Biztos hogy töröljem?', 'Biztos hogy töröljem?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      { text: 'Törlés', onPress: () => deleteItem },
    ]);
  };
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.historyItemContainer,
        styles.shadow,
        item.state === 'in' ? styles.containerIn : styles.containerOut,
      ]}>
      <View style={styles.historyTextContainer}>
        <View>
          <Text style={styles.currentStateText}>{item.date.toDate().toLocaleString('hu-HU')}</Text>
          <Text
            style={[
              styles.currentStateText,
              item.state === 'in' ? styles.currentStateTextIn : styles.currentStateTextOut,
            ]}>
            {item.state === 'in' ? 'bejött' : 'távozott'}
          </Text>
        </View>
        <View>
          {(() => {
            if (index === 0) {
              return (
                <TouchableOpacity onPress={createTwoButtonAlert}>
                  <SvgXml xml={trashIcon} />
                  <Text style={styles.deleteText}>Törlés</Text>
                </TouchableOpacity>
              );
            }

            return null;
          })()}
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    (async () => {
      console.log(props.userData.email);
      const historyFromFirebase = await getHistory(props.userData.email);
      setHistory(historyFromFirebase);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList data={history} renderItem={renderItem} keyExtractor={(item, index) => index} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'stretch',
    // https://stackoverflow.com/a/59183680/9004180
    // fixing the scrolling of the FlatList
    // flex: 1 just means "take up the entire space" (whatever "entire" that may be).
    flex: 1,
  },
  historyItemContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    margin: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTextContainer: {},
  currentStateText: {
    fontSize: 17,
    color: 'white',
  },
  containerIn: {
    backgroundColor: '#165BAA',
  },
  containerOut: {
    backgroundColor: '#173F5F',
  },
  shadow: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  deleteText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
