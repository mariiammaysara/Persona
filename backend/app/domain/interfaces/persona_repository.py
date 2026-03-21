'''
PersonaRepository interface — abstracts persona storage and retrieval.
The application layer depends on this interface, keeping it decoupled
from the concrete PersonaRegistry implementation.
'''
from abc import ABC, abstractmethod
from app.domain.entities.persona import Persona
from app.domain.enums import PersonaID


class PersonaRepository(ABC):
    '''Interface for persona data access.'''
    @abstractmethod
    def get(self, persona_id: PersonaID) -> Persona:
        '''Retrieve a persona by its unique ID.'''
        ...

    @abstractmethod
    def all(self) -> list[Persona]:
        '''Retrieve all available personas.'''
        ...
