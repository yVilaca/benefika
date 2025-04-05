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
import axios from "axios";

export default function Login() {
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
    axios.post(
      "http://127.0.0.1:8000/api/v1/auth/login",
      form.getTransformedValues()
    );
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
                <Button type="submit" fullWidth>
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
