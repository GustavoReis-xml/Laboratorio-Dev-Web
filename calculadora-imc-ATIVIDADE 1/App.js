import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState(null);
  const [classificacao, setClassificacao] = useState('');
  const [corClassificacao, setCorClassificacao] = useState('');
  const [erro, setErro] = useState('');

  const obterClassificacao = (valorImc) => {
    // Cores vibrantes estilo Frutiger Aero
    if (valorImc < 18.5) return { texto: 'Abaixo do Peso', cor: '#FFB300' }; // Amarelo vibrante
    if (valorImc >= 18.5 && valorImc <= 24.9) return { texto: 'Peso Normal (Eutrofia)', cor: '#00C853' }; // Verde "Wii"
    if (valorImc >= 25.0 && valorImc <= 29.9) return { texto: 'Sobrepeso', cor: '#FF8F00' }; // Laranja
    if (valorImc >= 30.0 && valorImc <= 34.9) return { texto: 'Obesidade Grau I', cor: '#FF5252' }; // Vermelho claro
    if (valorImc >= 35.0 && valorImc <= 39.9) return { texto: 'Obesidade Grau II', cor: '#D50000' }; // Vermelho forte
    return { texto: 'Obesidade Grau III', cor: '#880E4F' }; // Vinho
  };

  const calcularIMC = () => {
    setErro('');
    
    const p = parseFloat(peso.replace(',', '.'));
    const a = parseFloat(altura.replace(',', '.'));

    if (!p || !a || a <= 0) {
      setErro('⚠️ Preencha os campos corretamente.');
      setImc(null);
      return;
    }

    const calcImc = p / (a * a);
    setImc(calcImc.toFixed(2));

    const info = obterClassificacao(calcImc);
    setClassificacao(info.texto);
    setCorClassificacao(info.cor);
  };

  const limpar = () => {
    setPeso('');
    setAltura('');
    setImc(null);
    setClassificacao('');
    setCorClassificacao('');
    setErro('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <Text style={styles.titulo}>Calculadora IMC</Text>
          <Text style={styles.subtitulo}>Projeto Lab. Dev Web</Text>
        </View>

        {/* Card simulando efeito de vidro (Aero Glass) */}
        <View style={styles.aeroCard}>
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 75"
            placeholderTextColor="#89B4C4"
            keyboardType="numeric"
            value={peso}
            onChangeText={setPeso}
          />

          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1.75"
            placeholderTextColor="#89B4C4"
            keyboardType="numeric"
            value={altura}
            onChangeText={setAltura}
          />

          {/* Botão com estética glossy */}
          <TouchableOpacity style={styles.botaoCalcular} onPress={calcularIMC} activeOpacity={0.7}>
            <View style={styles.brilhoBotao}></View>
            <Text style={styles.textoBotaoCalcular}>Calcular Meu IMC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoLimpar} onPress={limpar} activeOpacity={0.6}>
            <Text style={styles.textoBotaoLimpar}>Limpar Dados</Text>
          </TouchableOpacity>
        </View>

        {imc && (
          <View style={styles.resultadoCard}>
            <View style={styles.brilhoCard}></View>
            <Text style={styles.resultadoLabel}>Índice de Massa Corporal:</Text>
            <Text style={styles.resultadoImc}>{imc}</Text>
            
            <View style={[styles.badge, { backgroundColor: corClassificacao, borderColor: '#FFFFFF', borderWidth: 2 }]}>
              <Text style={styles.classificacaoTexto}>
                {classificacao}
              </Text>
            </View>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Fundo simulando um céu limpo, típico do Frutiger Aero
    backgroundColor: '#D1EEFC', 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontSize: 34,
    fontWeight: '900',
    color: '#005C8A', // Azul profundo e vibrante
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitulo: {
    fontSize: 16,
    color: '#0084B4',
    marginTop: 2,
    fontWeight: '600',
  },
  aeroCard: {
    // Efeito "Aero Glass" - Acrílico translúcido
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 24,
    padding: 24,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    shadowColor: '#005C8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#004A70',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#AEE2FF',
    padding: 16,
    borderRadius: 16, // Arredondamento bem acentuado
    marginBottom: 20,
    fontSize: 16,
    color: '#00334E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  botaoCalcular: {
    // Verde vibrante com borda clara simulando o topo do "vidro"
    backgroundColor: '#00C853',
    paddingVertical: 16,
    borderRadius: 30, // Formato pílula clássico
    alignItems: 'center',
    marginBottom: 12,
    borderColor: '#69F0AE',
    borderTopWidth: 3,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  brilhoBotao: {
    // Um truque em CSS/RN para dar o reflexo de luz na parte superior do botão
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  textoBotaoCalcular: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  botaoLimpar: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  textoBotaoLimpar: {
    color: '#005C8A',
    fontSize: 16,
    fontWeight: '700',
  },
  erro: {
    color: '#FFFFFF',
    backgroundColor: '#FF5252',
    padding: 12,
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '800',
    borderColor: '#FF8A80',
    borderWidth: 2,
  },
  resultadoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    shadowColor: '#005C8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  brilhoCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  resultadoLabel: {
    fontSize: 16,
    color: '#005C8A',
    fontWeight: '700',
    marginBottom: 4,
    zIndex: 1,
  },
  resultadoImc: {
    fontSize: 54,
    fontWeight: '900',
    color: '#004A70',
    marginBottom: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    zIndex: 1,
  },
  badge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  classificacaoTexto: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});