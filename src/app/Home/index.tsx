import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { styles } from "./styles";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { FilterStatus } from "@/types/FilterStatus";
import { Item } from "@/components/Item";
import React from "react";
import { ItemStorage, itemsStorage } from "@/storage/itemsStorage";

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE];
const ITEMS = [
  { id: "1", status: FilterStatus.DONE, description: "1 pacote de café" },
  { id: "2", status: FilterStatus.PENDING, description: "Comprar açúcar" },
  { id: "3", status: FilterStatus.DONE, description: "Leite integral" },
  { id: "4", status: FilterStatus.PENDING, description: "Pão francês" },
  { id: "5", status: FilterStatus.PENDING, description: "Manteiga" },
  { id: "6", status: FilterStatus.DONE, description: "Queijo mussarela" },
  { id: "7", status: FilterStatus.PENDING, description: "Presunto" },
  { id: "8", status: FilterStatus.DONE, description: "Arroz 5kg" },
  { id: "9", status: FilterStatus.PENDING, description: "Feijão carioca" },
  { id: "10", status: FilterStatus.PENDING, description: "Macarrão espaguete" },
  { id: "11", status: FilterStatus.DONE, description: "Molho de tomate" },
  { id: "12", status: FilterStatus.PENDING, description: "Carne moída" },
  { id: "13", status: FilterStatus.DONE, description: "Peito de frango" },
  { id: "14", status: FilterStatus.PENDING, description: "Batata inglesa" },
  { id: "15", status: FilterStatus.DONE, description: "Cenoura" },
  { id: "16", status: FilterStatus.PENDING, description: "Alface" },
  { id: "17", status: FilterStatus.PENDING, description: "Tomate" },
  { id: "18", status: FilterStatus.DONE, description: "Cebola" },
  { id: "19", status: FilterStatus.PENDING, description: "Alho" },
  { id: "20", status: FilterStatus.DONE, description: "Óleo de soja" },
  { id: "21", status: FilterStatus.PENDING, description: "Sal refinado" },
  { id: "22", status: FilterStatus.DONE, description: "Farinha de trigo" },
  { id: "23", status: FilterStatus.PENDING, description: "Achocolatado" },
  { id: "24", status: FilterStatus.PENDING, description: "Biscoito recheado" },
  { id: "25", status: FilterStatus.DONE, description: "Refrigerante cola" },
  { id: "26", status: FilterStatus.PENDING, description: "Suco de laranja" },
  { id: "27", status: FilterStatus.DONE, description: "Iogurte natural" },
  { id: "28", status: FilterStatus.PENDING, description: "Ovos (cartela)" },
  { id: "29", status: FilterStatus.DONE, description: "Detergente" },
  { id: "30", status: FilterStatus.PENDING, description: "Sabão em pó" },
];

export function Home() {
  const [items, setItems] = React.useState<ItemStorage[]>([]);
  const [filter, setFilter] = React.useState(FilterStatus.PENDING);
  const [description, setDescrition] = React.useState("");

  async function handleAdd() {
    if (!description.trim()) {
      return Alert.alert("Adiconar", "Informe a descrição para adicionar");
    }
    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PENDING,
    };

    await itemsStorage.add(newItem);
    await getItemsByStatus();
    Alert.alert("Adicionado", `Adicionado ${description}`);
    setDescrition("");
    setFilter(FilterStatus.PENDING);
  }
  async function handleRemove(id: string) {
    try {
      await itemsStorage.remove(id);
      await getItemsByStatus();
    } catch (error) {
      console.log(error);
      Alert.alert("Remover", "Não foi possível remover o item.");
    }
  }

  async function getItemsByStatus() {
    const items = await itemsStorage.getByStatus(filter);
    setItems(items);
    try {
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível filtrar os itens.");
    }
  }
  function handleClear() {
    Alert.alert("Limpar", "Deseja remover todos?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => onClear() },
    ]);
  }

  async function onClear() {
    try {
      await itemsStorage.clear();
      setItems([]);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possivel remover todos os itens.");
    }
  }

  React.useEffect(() => {
    getItemsByStatus();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={styles.logo} />
      <View style={styles.form}>
        <Input
          placeholder="O que você precisa comprar?"
          onChangeText={setDescrition}
          value={description}
        />
        <Button title="Adicionar" onPress={handleAdd} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={status === filter}
              onPress={() => setFilter(status)}
            />
          ))}
          <TouchableOpacity style={styles.clearButtom}>
            <Text style={styles.clearText} onPress={handleClear}>
              Limpar
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onRemove={() => handleRemove(item.id)}
              onStatus={() => console.log("troca status")}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Nenhum item aqui.</Text>
          )}
        />
      </View>
    </View>
  );
}
