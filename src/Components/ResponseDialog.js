import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

{
  /* <Ionicons name="checkmark-circle-outline" size={24} color="#0afa2a" /> */
}

const ResponseDialog = ({
  title,
  message,
  color,
  actionButtonText,
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.card}>
          <TouchableOpacity onPress={onClose} style={styles.dismiss}>
            <Text style={styles.dismissText}>×</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <View style={styles.image}>
              <Ionicons
                name="checkmark-circle-outline"
                size={45}
                color="#0afa2a"
              />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>
                {message}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.history} onPress={onClose}>
                <Text style={styles.historyText}>{actionButtonText}</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.track}>
                <Text style={styles.trackText}>Track my package</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    overflow: "hidden",
    position: "relative",
    textAlign: "left",
    borderRadius: 10,
    maxWidth: 290,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 5,
    backgroundColor: "#fff",
  },
  dismiss: {
    position: "absolute",
    right: 10,
    top: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "#fff",
    color: "black",
    borderWidth: 2,
    borderColor: "#D1D5DB",
    fontSize: 16,
    fontWeight: "300",
    width: 30,
    height: 30,
    borderRadius: 7,
    transitionDuration: "0.3s",
  },
  dismissText: {
    fontSize: 16,
  },
  header: {
    padding: 20,
  },
  image: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#e2feee",
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 9999,
    animationDuration: "0.6s",
    animationTimingFunction: "linear",
    animationDirection: "alternate-reverse",
    animationIterationCount: "infinite",
    transitionDuration: "0.6s",
  },
  content: {
    marginTop: 15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#066e29",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  message: {
    marginTop: 10,
    color: "#595b5f",
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginTop: 15,
  },
  history: {
    display: "flex",
    padding: 10,
    backgroundColor: "#1aa06d",
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  historyText: {
    color: "#fff",
    textAlign: "center",
  },
  track: {
    display: "flex",
    marginTop: 15,
    padding: 10,
    color: "#242525",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trackText: {
    color: "#242525",
    textAlign: "center",
  },
});

export default ResponseDialog;
