import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import axios from "axios";

const API_KEY = "8W6FATS7SJRMDATR";

// ─── Color Palette ────────────────────────────────────────────────
const C = {
  bg:        "#080C14",
  surface:   "#0D1320",
  surfaceAlt:"#111927",
  border:    "#1C2A3E",
  borderFocus:"#2C6BE0",
  accent:    "#2C6BE0",
  accentGlow:"rgba(44,107,224,0.25)",
  accentSoft:"rgba(44,107,224,0.12)",
  green:     "#22C55E",
  greenGlow: "rgba(34,197,94,0.2)",
  red:       "#EF4444",
  redGlow:   "rgba(239,68,68,0.2)",
  textPrimary:   "#F1F5F9",
  textSecondary: "#64748B",
  textMuted:     "#334155",
  gold:      "#F59E0B",
};

function StatCard({ label, value, prefix = "$" }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        <Text style={styles.statPrefix}>{prefix}</Text>
        {parseFloat(value).toFixed(2)}
      </Text>
    </View>
  );
}

function Badge({ text, type = "default" }) {
  const colors = {
    live:    { bg: "rgba(34,197,94,0.1)",  text: C.green, dot: C.green },
    default: { bg: C.accentSoft, text: C.accent, dot: null },
  };
  const c = colors[type];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      {c.dot && <View style={[styles.badgeDot, { backgroundColor: c.dot }]} />}
      <Text style={[styles.badgeText, { color: c.text }]}>{text}</Text>
    </View>
  );
}

export default function App() {
  const [symbol, setSymbol] = useState("AAPL");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  // Animations
  const cardOpacity  = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(24)).current;
  const spinAnim     = useRef(new Animated.Value(0)).current;

  const animateCardIn = () => {
    cardOpacity.setValue(0);
    cardTranslate.setValue(24);
    Animated.parallel([
      Animated.timing(cardOpacity,   { toValue: 1,  duration: 400, useNativeDriver: true }),
      Animated.spring(cardTranslate, { toValue: 0,  useNativeDriver: true, tension: 80, friction: 12 }),
    ]).start();
  };

  const fetchStockData = async () => {
    if (!symbol.trim()) {
      Alert.alert("Campo obrigatório", "Insira um código de ação válido.");
      return;
    }
    setLoading(true);
    Keyboard.dismiss();

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const quote = response.data["Global Quote"];

      if (quote && Object.keys(quote).length > 0) {
        const formatted = [{
          id: "1",
          symbol:  quote["01. symbol"],
          price:   quote["05. price"],
          open:    quote["02. open"],
          high:    quote["03. high"],
          low:     quote["04. low"],
          close:   quote["08. previous close"],
          change:  quote["10. change percent"],
          volume:  quote["06. volume"],
        }];
        setData(formatted);
        animateCardIn();
      } else {
        setData([]);
        Alert.alert("Ação não encontrada", "Verifique o código ou tente novamente mais tarde.");
      }
    } catch (error) {
      Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStockData(); }, []);

  const isPositive = data[0]?.change && !data[0].change.includes("-");
  const changeColor = isPositive ? C.green : C.red;
  const changeGlow  = isPositive ? C.greenGlow : C.redGlow;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appTitle}>MarketView</Text>
            <Text style={styles.appSubtitle}>Cotações em tempo real</Text>
          </View>
          <Badge text="LIVE" type="live" />
        </View>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrapper}>
        <View
          style={[
            styles.inputWrapper,
            focused && { borderColor: C.accent, backgroundColor: "rgba(44,107,224,0.05)" },
          ]}
        >
          <Text style={styles.inputIcon}>⌕</Text>
          <TextInput
            style={styles.input}
            placeholder="Ticker (ex: AAPL, PETR4)"
            placeholderTextColor={C.textMuted}
            value={symbol}
            onChangeText={setSymbol}
            autoCapitalize="characters"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={fetchStockData}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={[styles.searchBtn, loading && { opacity: 0.6 }]}
          onPress={fetchStockData}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={C.accent} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      ) : data.length > 0 ? (
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] },
          ]}
        >
          {/* Card Header */}
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.ticker}>{data[0].symbol}</Text>
              <Text style={styles.exchange}>NASDAQ · USD</Text>
            </View>
            <View style={styles.changeChip}>
              <Text style={[styles.changeChipText, { color: changeColor }]}>
                {isPositive ? "▲" : "▼"} {data[0].change}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.currencySign}>$</Text>
            <Text style={styles.priceMain}>
              {parseFloat(data[0].price).toFixed(2)}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard label="Abertura"    value={data[0].open} />
            <StatCard label="Máxima"      value={data[0].high} />
            <StatCard label="Mínima"      value={data[0].low}  />
            <StatCard label="Fechamento"  value={data[0].close} />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Volume / Change Footer */}
          <View style={styles.footerRow}>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>Variação diária</Text>
              <Text style={[styles.footerValue, { color: changeColor }]}>
                {data[0].change}
              </Text>
            </View>
            {data[0].volume && (
              <View style={[styles.footerItem, { alignItems: "flex-end" }]}>
                <Text style={styles.footerLabel}>Volume</Text>
                <Text style={styles.footerValue}>
                  {parseInt(data[0].volume).toLocaleString("pt-BR")}
                </Text>
              </View>
            )}
          </View>

          {/* Glow accent line */}
          <View style={[styles.cardAccent, { backgroundColor: changeColor, shadowColor: changeColor }]} />
        </Animated.View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📈</Text>
          <Text style={styles.emptyTitle}>Nenhum dado exibido</Text>
          <Text style={styles.emptyDesc}>
            Digite o código de uma ação e toque em Buscar para ver a cotação.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 48,
    minHeight: "100%",
  },

  // ── Header
  header: {
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
    letterSpacing: 0.2,
  },

  // ── Badge
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  // ── Search
  searchWrapper: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 8,
    transition: "border-color 0.2s",
  },
  inputIcon: {
    fontSize: 20,
    color: C.textSecondary,
    marginTop: -2,
  },
  input: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  searchBtn: {
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  searchBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // ── Loader
  loaderArea: {
    alignItems: "center",
    marginTop: 60,
    gap: 14,
  },
  loadingText: {
    color: C.textSecondary,
    fontSize: 14,
    letterSpacing: 0.2,
  },

  // ── Card
  card: {
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 10,
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    marginTop: 6,
  },
  ticker: {
    fontSize: 22,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: 0.5,
  },
  exchange: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  changeChip: {
    backgroundColor: C.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  changeChipText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── Price
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 4,
  },
  currencySign: {
    fontSize: 22,
    fontWeight: "300",
    color: C.textSecondary,
    marginTop: 8,
  },
  priceMain: {
    fontSize: 48,
    fontWeight: "300",
    color: C.textPrimary,
    letterSpacing: -1,
    lineHeight: 56,
  },

  // ── Divider
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 20,
  },

  // ── Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: C.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: C.textPrimary,
    letterSpacing: 0.3,
  },
  statPrefix: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: "400",
  },

  // ── Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerItem: {
    gap: 4,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  footerValue: {
    fontSize: 18,
    fontWeight: "700",
    color: C.textPrimary,
    letterSpacing: 0.3,
  },

  // ── Empty
  emptyState: {
    alignItems: "center",
    marginTop: 70,
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.textPrimary,
  },
  emptyDesc: {
    fontSize: 14,
    color: C.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});