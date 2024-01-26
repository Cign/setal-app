import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { FlashList } from "@shopify/flash-list";

const DropdownList = ({ data, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleFilter = (text) => {
    setFilterText(text);
    const filteredItems = data.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredItems);
  };

  const handleSelectItem = (item) => {
    setModalVisible(false);
    setFilterText('');
    onSelect(item);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectItem(item)} style={styles.item}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.inputContainer}
      >
        <TextInput
          placeholder="Select an option"
          value={filterText}
          onChangeText={handleFilter}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({

  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    maxHeight: 300,
    width: 200,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default DropdownList;
