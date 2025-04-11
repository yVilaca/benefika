import { Badge, Button, Card, Flex, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconThumbUp } from "@tabler/icons-react";
import axios from "axios";

interface Props {
  objetivo: object;
  ehAdmin: boolean;
}

export default function ObjetivoCard({ objetivo, ehAdmin }: Props) {
  function votar(objetivo: any) {
    if (!objetivo || objetivo.status === "Concluida") {
      return;
    }

    axios
      .post(
        `http://127.0.0.1:8000/api/objetivo/${(objetivo as any).id}/votar/`,
        {
          positivo: true,
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
          <IconThumbUp size={16} stroke={1.5} />
          <Text size="sm" fw={600}>
            {(objetivo as any).total_votos} votos
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
              size="xs"
              onClick={() => {
                votar(objetivo as any);
              }}
            >
              Votar
            </Button>
          </Group>
        )}
      </Flex>
    </Card>
  );
}
