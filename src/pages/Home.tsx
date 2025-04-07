import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import NavBar from "../componentes/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  IconCalendar,
  IconPencil,
  IconStarFilled,
  IconThumbUp,
  IconTrophy,
  IconUser,
} from "@tabler/icons-react";

export default function Home() {
  interface Objetivo {
    id: number;
    titulo: string;
    descricao: string;
    votos: number;
    aprovado: boolean;
    criado_por: string;
    data_criacao: string;
    status: string;
    progresso: number;
  }
  interface User {
    cargo: string;
  }
  const user = jwtDecode(localStorage.getItem("token") as string);

  const [objetivos, setObjetivos] = useState([]);
  const [objetivoEmAndamento, setObjetivoEmAndamento] = useState({});
  const [ehAdmin, setEhAdmin] = useState(false);

  useEffect(() => {
    getObjetivos();
    setEhAdmin((user as User).cargo === "Administrador" ? true : false);
  }, []);

  const getObjetivos = async () => {
    await axios.get("http://127.0.0.1:8000/api/objetivos/").then((response) => {
      setObjetivos(response.data);
      setObjetivoEmAndamento(
        response.data.filter(
          (objetivo: Objetivo) => objetivo.aprovado == true
        )[0]
      );
      console.log(
        response.data.filter(
          (objetivo: Objetivo) => objetivo.aprovado === true
        )[0]
      );
    });
  };

  function formatData(data: string) {
    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, "0");
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, "0");
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <>
      <NavBar />
      <Card mt="xl" w="100%" shadow="md" p="lg" radius="md">
        <Box mb="md">
          <Group mb="xs">
            <ThemeIcon color="yellow" size="lg" variant="light" radius="xl">
              <IconStarFilled size={20} />
            </ThemeIcon>
            <Text size="lg" fw={700}>
              Objetivo Em Andamento
            </Text>
          </Group>
          <Divider />
        </Box>

        <Card shadow="sm" padding="lg" radius="md">
          <Stack gap="md">
            <Stack gap={4}>
              <Text
                size="xl"
                fw={700}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
              >
                {(objetivoEmAndamento as Objetivo).titulo}
              </Text>
              <Text c="dimmed" size="sm" maw={500}>
                {(objetivoEmAndamento as Objetivo).descricao}
              </Text>
            </Stack>

            <Group justify="space-between">
              <Badge
                color={status === "Em Andamento" ? "blue" : "green"}
                size="md"
              >
                {(objetivoEmAndamento as Objetivo).status}
              </Badge>
              <Group gap={6}>
                <IconThumbUp size={16} stroke={1.5} />
                <Text size="sm" fw={500}>
                  {(objetivoEmAndamento as Objetivo).votos} votos
                </Text>
              </Group>
            </Group>

            <Divider my="sm" />

            <Group gap={6}>
              <IconUser size={18} stroke={1.5} />
              <Text size="sm">
                <Text span fw={500}>
                  Criado por:{" "}
                </Text>
                {(objetivoEmAndamento as Objetivo).criado_por || "Anônimo"}
              </Text>
            </Group>

            <Group gap={6}>
              <IconCalendar size={18} stroke={1.5} />
              <Text size="sm">
                <Text span fw={500}>
                  Data:{" "}
                </Text>
                {formatData((objetivoEmAndamento as Objetivo).data_criacao)}
              </Text>
            </Group>

            <Box>
              <Group justify="space-between" mb={6}>
                <Text fw={600} size="sm">
                  Progresso:
                </Text>
                <Group gap={4}>
                  <Text fw={600} size="sm">
                    {(objetivoEmAndamento as Objetivo).progresso}%
                  </Text>
                  {ehAdmin && (
                    <ActionIcon size="sm" color="blue" variant="subtle">
                      <IconPencil size={14} />
                    </ActionIcon>
                  )}
                </Group>
              </Group>
              <Progress
                value={(objetivoEmAndamento as Objetivo).progresso}
                color={
                  (objetivoEmAndamento as Objetivo).progresso < 30
                    ? "red"
                    : (objetivoEmAndamento as Objetivo).progresso < 70
                    ? "yellow"
                    : "green"
                }
                size="lg"
                radius="xl"
                striped
                animated
              />
            </Box>
          </Stack>
        </Card>

        {ehAdmin && (
          <Group justify="right" mt="lg">
            <Button variant="outline" color="gray">
              Cancelar
            </Button>
            <Button leftSection={<IconTrophy size={20} />} color="green">
              Concluir Objetivo
            </Button>
          </Group>
        )}
      </Card>

      <Text fw={600} mt={"lg"}>
        Todos os objetivos:
      </Text>

      <Flex gap="md">
        {objetivos.map((objetivo) => {
          return (
            <Card p={'md'} mt="sm" shadow="md" radius="md" w="fit-content">
              <Group align="center">
                <Text size="md" fw={600} lineClamp={1}>
                  {(objetivo as Objetivo).titulo}
                </Text>
                <Badge
                  color={
                    (objetivo as Objetivo).status === "Concluida"
                      ? "gray"
                      : "green"
                  }
                  variant="light"
                  size="md"
                >
                  {(objetivo as Objetivo).status}
                </Badge>
              </Group>

              <Text
                c="dimmed"
                size="sm"
                maw={400}
                lineClamp={3}
                style={{ minHeight: "3.6em" }}
              >
                {(objetivo as Objetivo).descricao}
              </Text>

              <Flex justify={'space-between'} mt={'sm'}>
                <Group>
                  <IconThumbUp size={16} stroke={1.5} />
                  <Text size="sm" fw={600}>
                    {(objetivo as Objetivo).votos} votos
                  </Text>
                </Group>
                {ehAdmin && (objetivo as Objetivo).status != "Concluida" && (
                  <Group justify="right">
                    <Button size="xs" variant="light">
                      Reprovar
                    </Button>
                    <Button size="xs">Aprovar</Button>
                  </Group>
                )}
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </>
  );
}
