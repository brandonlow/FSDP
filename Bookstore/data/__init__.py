from __future__ import annotations
from contextlib import ContextDecorator
from typing import Generic, TypeVar, Type, Dict, List
from uuid import UUID, uuid4
from datetime import datetime
# from data.user import User

import shelve
import os
import uuid

# Generic Type for template classes
T = TypeVar('T')


class TableRow(Generic[T]):
    """
	This class structure represents a single row in a table
	"""

    def __init__(self, uid: str = None):
        self.__uuid = uuid.uuid4() if (uid is None) else uuid.UUID(uid)
        self.__date_updated = datetime.utcnow()
        self.__date_created = datetime.utcnow()

    @property
    def uuid(self) -> UUID:
        return self.__uuid

    @uuid.setter
    def uuid(self, value: UUID):
        self.__uuid = value

    @property
    def date_created(self) -> datetime:
        return self.__date_created

    @property
    def date_updated(self) -> datetime:
        return self.__date_updated

    def update_timestamp(self):
        self.__date_updated = datetime.utcnow()

    def __repr__(self) -> str:
        return str(self)

    def __str__(self) -> str:
        return f"<Type:{self.__class__.__name__}> uuid: {str(self.uuid)}"

    def to_json(self) -> dict:
        return {
            "uuid": str(self.__uuid),
            "dateCreated": self.__date_created.isoformat(),
            "dateUpdated": self.__date_updated.isoformat()
        }


class Table(Generic[T]):
    """
	Table class template for generic usages. The table assumes every row is mapped by uuidv4.
	"""

    def __init__(self, handle: shelve.Shelf):
        """
		:param handle:	Shelve file handle
		"""
        if self.name not in handle:
            handle[self.name] = dict()
            handle.sync()

        self.__handle: shelve.Shelf = handle
        self.__cache: Dict[UUID, T] = self.__handle[self.name]

    @property
    def _table(self) -> Dict[UUID, T]:
        """
		Short hand for accessing the table directly.
		If table do not exists yet, it creates an instance in the shelve
		:return: Dictionary map of [UUID, T]
		"""
        # Create table instance in the handle if not exists
        return self.__cache

    @property
    def name(self) -> str:
        """
		The name of the table and key that is used to reference in shelve
		:return: The table's name
		"""
        raise NotImplementedError("Each table must have a name")

    def commit(self):
        """
		Commit Changes to the database handle
		:return:
		"""
        self.__handle[self.name] = self.__cache
        self.__handle.sync()

    def size(self) -> int:
        """
		:return: Number of rows in the table
		"""
        return len(self._table)

    def list(self) -> List[T]:
        """
		:return: List of type T
		"""
        return list(self._table.values())

    def insert(self, value: TableRow) -> T:
        """
		Inserts the specified value
		:param value: Content to insert
		:return: The inserted content with a assigned uuid
		"""
        if value.uuid is None:
            value.uuid = uuid4()
        self._table[value.uuid] = value
        return value

    def delete(self, uuid: UUID):
        """
		Remove a specified uuid row
		:param uuid: The uuid of the row to be removed
		"""
        if not self.contains(uuid):
            raise KeyError(f"The row entry {uuid} is not found in {self.name}")
        else:
            del self._table[uuid]

    def clear(self):
        """
		Empties the current cached table
		"""
        self._table.clear()

    def update(self, uuid: UUID, value: T):
        """
		Updates a specified uuid row content
		:param uuid: The uuid of the row to be updated
		:param value:The value to replace with
		:return:
		"""
        if not self.contains(uuid):
            raise KeyError(f"The row entry {uuid} is not found in {self.name}")
        else:
            self._table[uuid] = value
        return self._table[uuid]

    def contains(self, uuid: UUID) -> bool:
        """
		Whether the table contains a specific row
		:param uuid: The uuid to look up
		:return: True if exists else False
		"""
        return uuid in self._table

    def select(self, query: dict) -> List[T]:
        """
		Performs a select query to extract by conditions
		:param query:	Arbitrary query dictionary to use
		:return:
		"""
        raise NotImplementedError("Select function not implemented")


class Database(ContextDecorator):
    """
	Database for the application
	Sample usage:
	```python
		with Database() as db:
			table = db.get_table(UserTable)
			table.
	```
	"""

    def __init__(self, filename: str = "data.db3"):
        """
		:param filename:	Which file to use
		"""
        self.__file: str = os.path.join(os.getcwd(), filename)
        self.__handle: shelve.Shelf = shelve.open(self.__file, flag="c")

    def __enter__(self) -> Database:
        """
		Open the data, with context
		:return:
		"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """
		Auto close the data handle
		:return:
		"""
        self.close()

    def close(self):
        return self.__handle.close()

    def commit(self):
        self.__handle.sync()

    def table(self, table_type: Type[T]) -> T:
        """
		Retrieves a table using a class type
		:param table_type: The Class name of the DAO table
		:return:The reference to the table in the data
		"""
        if not issubclass(table_type, Table):
            raise TypeError(f"{table_type} must be a subclass of Table")
        return table_type(self.__handle)
