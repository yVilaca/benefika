import { Avatar, Badge, Card, Flex, Group, Text, Title } from "@mantine/core";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";

export default function NavBar() {
  const nomeCompleto =
    localStorage.getItem("nome") + " " + localStorage.getItem("sobrenome");
  const empresaNome = localStorage.getItem("empresa");
  const cargo = localStorage.getItem("cargo");

  return (
    <Flex justify='space-between'>
      <Title order={1} c="#1c7ed6">
        <IconRosetteDiscountCheckFilled /> Benefika
      </Title>

      <Card >
        <Flex justify={'center'} gap="md" align={'center'}>
          <Avatar
            key={nomeCompleto}
            name={nomeCompleto}
            color="initials"
            allowedInitialsColors={["blue", "red"]}
          />
          <Flex gap={'md'}>

          <Text key={nomeCompleto} fw={600}>
            {nomeCompleto}
            <Text size="sm" key={empresaNome}>
              {empresaNome}
            </Text>
          </Text>
          <Badge mt={3}>{cargo}</Badge>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
