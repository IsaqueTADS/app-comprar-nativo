import { View, Text, StyleSheet } from "react-native";

import { styles } from "./styles";

export function CreditsFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.brand}>Aplicativo criado por Isaque TADS</Text>
      <Text style={styles.copy}>© 2026 • Todos os direitos reservados</Text>
    </View>
  );
}
