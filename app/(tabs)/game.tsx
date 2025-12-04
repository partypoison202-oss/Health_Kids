import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  speed?: number;
};

type KeysState = {
  left: boolean;
  right: boolean;
  shoot: boolean;
};

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const BULLET_WIDTH = 8;
const BULLET_HEIGHT = 16;
const ENEMY_SIZE = 36;

function rectsCollide(a: Box, b: Box) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export default function Game() {
  const { width } = useWindowDimensions();
  const height = 600; // alto fijo del área de juego

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const playerRef = useRef<Box>({
    x: width / 2 - PLAYER_WIDTH / 2,
    y: height - 80,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT,
    speed: 6,
  });

  const padRef = useRef<View | null>(null);
    // 3) pega estas funciones dentro del componente Game (reemplazan a las previas handleTouches/clearTouches)
const handleTouches = (e: any) => {
  // e.nativeEvent.touches -> array de toques con .pageX
  const touches = e.nativeEvent.touches || [];
  // si no hay padRef aún, no hacemos nada
  if (!padRef.current) return;

  // Medimos la posición y tamaño del pad en pantalla (px, py son coordenadas absolutas)
  // measure(callback) => (fx, fy, width, height, px, py)
  padRef.current.measure((_fx, _fy, padW, _padH, padPageX, _padPageY) => {
    // resetear teclas
    keysRef.current.left = false;
    keysRef.current.right = false;
    keysRef.current.shoot = false;

    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      const pageX = t.pageX;
      const relX = pageX - padPageX; // posición relativa dentro del pad

      // seguridad: clamp
      if (relX < 0) continue;
      if (relX > padW) continue;

      if (relX < padW / 3) {
        keysRef.current.left = true;
      } else if (relX < (2 * padW) / 3) {
        keysRef.current.shoot = true;
      } else {
        keysRef.current.right = true;
      }
    }
  });
};

const clearTouches = () => {
  keysRef.current.left = false;
  keysRef.current.right = false;
  keysRef.current.shoot = false;
};

  const bulletsRef = useRef<Box[]>([]);
  const enemiesRef = useRef<Box[]>([]);
  const keysRef = useRef<KeysState>({
    left: false,
    right: false,
    shoot: false,
  });

  const lastShotRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Forzar re-render cuando cambie algo visual
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick((t) => t + 1);

  function spawnEnemy() {
    const w = ENEMY_SIZE + Math.random() * 24;
    const h = w;
    const x = Math.random() * (width - w);
    const y = -h;
    const speed = 1.2 + Math.random() * 1.8;
    enemiesRef.current.push({ x, y, w, h, speed });
  }

  function update(dt: number) {
    if (gameOver) return;
    const player = playerRef.current;
    const bullets = bulletsRef.current;
    const enemies = enemiesRef.current;
    const keys = keysRef.current;

    // Movimiento jugador
    if (keys.left) player.x -= player.speed || 0;
    if (keys.right) player.x += player.speed || 0;

    if (player.x < 0) player.x = 0;
    if (player.x > width - player.w) player.x = width - player.w;

    // Disparos
    lastShotRef.current += dt;
    const shotInterval = 200;
    if (keys.shoot && lastShotRef.current >= shotInterval) {
      bullets.push({
        x: player.x + player.w / 2 - BULLET_WIDTH / 2,
        y: player.y - BULLET_HEIGHT,
        w: BULLET_WIDTH,
        h: BULLET_HEIGHT,
        speed: 8,
      });
      lastShotRef.current = 0;
    }

    // Actualizar balas
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= bullets[i].speed || 0;
      if (bullets[i].y + bullets[i].h < 0) bullets.splice(i, 1);
    }

    // Spawn enemigos
    spawnTimerRef.current += dt;
    const spawnEvery = Math.max(
      500 - Math.min(350, Math.floor(score / 5) * 10),
      150
    );
    if (spawnTimerRef.current >= spawnEvery) {
      spawnEnemy();
      spawnTimerRef.current = 0;
    }

    // Actualizar enemigos
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.y += (e.speed || 0) + Math.min(2.2, score / 50);

      // enemigo llega al fondo
      if (e.y > height) {
        enemies.splice(i, 1);
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) setGameOver(true);
          return nl;
        });
        continue;
      }

      // colisión con balas
      for (let j = bullets.length - 1; j >= 0; j--) {
        if (rectsCollide(e, bullets[j])) {
          enemies.splice(i, 1);
          bullets.splice(j, 1);
          setScore((s) => s + 10);
          break;
        }
      }

      // colisión con jugador
      if (rectsCollide(e, player)) {
        enemies.splice(i, 1);
        setLives((l) => {
          const nl = l - 1;
          if (nl <= 0) setGameOver(true);
          return nl;
        });
      }
    }
  }

  function loop(now: number) {
    if (lastTimeRef.current == null) {
      lastTimeRef.current = now;
    }
    const dt = now - lastTimeRef.current;
    lastTimeRef.current = now;

    update(dt);
    forceUpdate(); // para que React pinte nuevas posiciones

    rafRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, width]);

  function restart() {
    playerRef.current = {
      x: width / 2 - PLAYER_WIDTH / 2,
      y: height - 80,
      w: PLAYER_WIDTH,
      h: PLAYER_HEIGHT,
      speed: 6,
    };
    bulletsRef.current = [];
    enemiesRef.current = [];
    keysRef.current = { left: false, right: false, shoot: false };
    lastShotRef.current = 0;
    spawnTimerRef.current = 0;
    lastTimeRef.current = null;
    setScore(0);
    setLives(3);
    setGameOver(false);
  }

  // Controles táctiles (izquierda / disparo / derecha)
  const handlePressLeftDown = () => {
    keysRef.current.left = true;
  };
  const handlePressLeftUp = () => {
    keysRef.current.left = false;
  };
  const handlePressRightDown = () => {
    keysRef.current.right = true;
  };
  const handlePressRightUp = () => {
    keysRef.current.right = false;
  };
  const handlePressShootDown = () => {
    keysRef.current.shoot = true;
  };
  const handlePressShootUp = () => {
    keysRef.current.shoot = false;
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mini Shooter</Text>

      {/* Área de juego */}
      <View style={[styles.gameArea, { width, height }]}>
        {/* Jugador */}
        <View
          style={{
            position: "absolute",
            left: playerRef.current.x,
            top: playerRef.current.y,
            width: playerRef.current.w,
            height: playerRef.current.h,
            backgroundColor: "#58D68D",
            borderRadius: 4,
          }}
        />

        {/* Balas */}
        {bulletsRef.current.map((b, idx) => (
          <View
            key={`b-${idx}`}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              backgroundColor: "#F9E79F",
              borderRadius: 4,
            }}
          />
        ))}

        {/* Enemigos */}
        {enemiesRef.current.map((e, idx) => (
          <View
            key={`e-${idx}`}
            style={{
              position: "absolute",
              left: e.x,
              top: e.y,
              width: e.w,
              height: e.h,
              backgroundColor: "#EC7063",
              borderRadius: 4,
            }}
          />
        ))}

        {/* HUD */}
        <View style={styles.hudRow}>
          <Text style={styles.hudText}>Score: {score}</Text>
          <Text style={styles.hudText}>Lives: {lives}</Text>
        </View>

        {gameOver && (
          <View style={styles.gameOverOverlay}>
            <Text style={styles.gameOverTitle}>GAME OVER</Text>
            <Text style={styles.gameOverText}>Final score: {score}</Text>
            <TouchableOpacity style={styles.restartBtn} onPress={restart}>
              <Text style={styles.restartText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Controles táctiles */}
      <View
  ref={(r) => {
    padRef.current = r;
  }}
  style={styles.touchPad}
  onStartShouldSetResponder={() => true}
  onMoveShouldSetResponder={() => true}
  onResponderGrant={(e) => handleTouches(e)}
  onResponderMove={(e) => handleTouches(e)}
  onResponderRelease={() => clearTouches()}
  onResponderTerminate={() => clearTouches()}
>
  <View style={styles.touchZone}>
    <Text style={styles.controlText}>◀</Text>
  </View>
  <View style={[styles.touchZone, styles.shootZone]}>
    <Text style={styles.controlText}>●</Text>
  </View>
  <View style={styles.touchZone}>
    <Text style={styles.controlText}>▶</Text>
  </View>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020615",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  gameArea: {
    backgroundColor: "#071126",
    borderRadius: 12,
    overflow: "hidden",
  },
  hudRow: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hudText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  gameOverOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverTitle: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "800",
    marginBottom: 8,
  },
  gameOverText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 16,
  },
  restartBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3498DB",
    borderRadius: 20,
  },
  restartText: {
    color: "#fff",
    fontWeight: "700",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "80%",
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: "#1B2631",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  controlText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  shootButton: {
    backgroundColor: "#8E44AD",
  },
  // NUEVOS
  touchPad: {
    flexDirection: "row",
    marginTop: 16,
    width: "90%",
    alignItems: "stretch",
  },
  touchZone: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#1B2631",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  shootZone: {
    backgroundColor: "#8E44AD",
  },
});
