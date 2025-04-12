import { Badge, Button, Card, Flex, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  objetivo: object;
  ehAdmin: boolean;
}

export default function ObjetivoCard({ objetivo, ehAdmin }: Props) {
  const [votosFeitos, setVotosFeitos] = useState<any>([]);
  const [refresh, setRefresh] = useState<any>([]);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/votos/`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setVotosFeitos(response.data);
      });
  }, [refresh]);

  function votar(objetivo: any, positivo: boolean) {
    setRefresh(!refresh);
    if (!objetivo || objetivo.status === "Concluida") {
      return;
    }

    if (votosFeitos.some((voto: any) => voto.objetivo_id == objetivo.id)) {
      if (
        votosFeitos.some(
          (voto: any) =>
            voto.objetivo_id === (objetivo as any).id &&
            voto.positivo == positivo
        )
      ){
        axios.delete(
          `http://127.0.0.1:8000/api/objetivo/${(objetivo as any).id}/remover_voto/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        ).then(()=>{
          setRefresh(!refresh);
        })
        setRefresh(!refresh);
        return;
      }

      axios
        .patch(
          `http://127.0.0.1:8000/api/objetivo/${(objetivo as any).id}/votar/`,
          {
            positivo: positivo,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          notifications.show({
            title: "Obrigado por votar!",
            message: "Seu voto foi registrado com sucesso!",
            color: "green",
            position: "top-right",
          });
        });
        setRefresh(!refresh);
        return;
    }

    axios
      .post(
        `http://127.0.0.1:8000/api/objetivo/${(objetivo as any).id}/votar/`,
        {
          positivo: positivo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        notifications.show({
          title: "Obrigado por votar!",
          message: "Seu voto foi registrado com sucesso!",
          color: "green",
          position: "top-right",
        });
      })
      .catch((e) => {
        notifications.show({
          position: "top-right",
          title: "Não foi possível registrar seu voto!",
          message: `${e.response.data.message}`,
          color: "red",
        });
      });
  }

  return (
    <Card p="md" mt="sm" shadow="md" radius="md" w="fit-content">
      <Group align="center">
        <Text size="md" fw={600} lineClamp={1}>
          {(objetivo as any).titulo}
        </Text>
        <Badge
          color={(objetivo as any).status === "Concluida" ? "gray" : "green"}
          variant="light"
          size="md"
        >
          {(objetivo as any).status}
        </Badge>
      </Group>

      <Text
        c="dimmed"
        size="sm"
        maw={400}
        lineClamp={3}
        style={{ minHeight: "3.6em" }}
      >
        {(objetivo as any).descricao}
      </Text>

      <Flex justify="space-between" mt="sm">
        <Group>
          <IconThumbUp size={16} />
          <Text size="sm" fw={600}>
            {(objetivo as any).total_votos}{" "}
            {(objetivo as any)?.total_votos == (1 || -1)
              ? ` Aprovação`
              : ` Aprovações`}
          </Text>
        </Group>
        {ehAdmin && (objetivo as any).status !== "Concluida" && (
          <Group justify="right">
            <Button size="xs" variant="light">
              Reprovar
            </Button>
            <Button size="xs">Aprovar</Button>
          </Group>
        )}

        {!ehAdmin && (
          <Group justify="right">
            <Button
              variant="light"
              size="xs"
              onClick={() => {
                votar(objetivo as any, true);
              }}
            >
              {votosFeitos.some(
                (voto: any) =>
                  voto.objetivo_id === (objetivo as any).id &&
                  voto.positivo == true
              ) ? (
                <IconThumbUpFilled size={20} />
              ) : (
                <IconThumbUp size={20} />
              )}
            </Button>
            <Button
              variant="light"
              size="xs"
              onClick={() => {
                votar(objetivo as any, false);
              }}
            >
              {votosFeitos.some(
                (voto: any) =>
                  voto.objetivo_id === (objetivo as any).id &&
                  voto.positivo == false
              ) ? (
                <IconThumbDownFilled size={20} />
              ) : (
                <IconThumbDown size={20} />
              )}
            </Button>
          </Group>
        )}
      </Flex>
    </Card>
  );
}
