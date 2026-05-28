import logging
import sys

def setup_logging():
    """
    Set up global application logging configuration.
    Uses standard stdout formatting for containers and dev servers.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
