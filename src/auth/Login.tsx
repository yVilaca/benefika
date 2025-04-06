import {
  Button,
  Card,
  Center,
  Flex,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export default function Login() {
  interface DecodedToken {
    nome: string;
    sobrenome: string;
    email: string;
    cargo: "Funcionário" | "Administrador" | "Gerente";
    exp: number;
    iat: number;
  }
  
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", senha: "" },
    validateInputOnBlur: true,

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "E-mail inválido"),
      senha: (value) => (value.length < 1 ? "Digite a senha" : null),
    },
    transformValues: (values) => ({
      email: values.email,
      username: values.email,
      password: values.senha,
    }),
  });

  function login() {
    setLoading(true);
    axios
      .post("http://127.0.0.1:8000/api/login/", form.getTransformedValues())
      .then((response) => {
        localStorage.setItem("token", response.data.access);
        const user = jwtDecode(response.data.access);
        localStorage.setItem("nome", (user as DecodedToken).nome);
        localStorage.setItem("sobrenome", (user as DecodedToken).sobrenome);
        localStorage.setItem("email", (user as DecodedToken).email);
        localStorage.setItem("cargo", (user as DecodedToken).cargo);
      
        notifications.show({
          position: "top-right",
          title: "Login realizado com sucesso",
          message:
            "Que bom te ver por aqui! Você será redirecionado para a página inicial.",
          autoClose: 2000,
        });
        window.location.href = "/p";
      })
      .catch((error) => {
        form.setErrors({
          email: "E-mail ou senha inválidos",
          senha: "E-mail ou senha inválidos",
        });
        notifications.show({
          position: "top-right",

          title: "Erro ao realizar login",
          message: "Verifique seu e-mail e senha",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Center h={"100vh"}>
      <Flex direction="column" justify="center">
        <Title ta="center" order={1} c="#1c7ed6">
          Benefika
        </Title>
        <Text ta="center">Seja bem-vindo de volta</Text>
        <Card miw={350} p="md" shadow="md" radius="md" mt="md">
          <form onSubmit={form.onSubmit(() => login())}>
            <Flex direction="column" gap="sm">
              <TextInput
                label="E-mail"
                placeholder="Digite seu e-mail"
                withAsterisk
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                withAsterisk
                key={form.key("senha")}
                {...form.getInputProps("senha")}
              />
              <Group gap={0} justify="end">
                <Button type="submit" fullWidth loading={loading}>
                  Entrar
                </Button>
                <Button variant="transparent" p={0} size="sm">
                  Equeci minha senha
                </Button>
              </Group>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Center>
  );
}
