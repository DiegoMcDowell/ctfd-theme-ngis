"""
Helpers para el icono de equipo: validación, subida y limpieza del archivo previo.
"""
from flask import url_for
from werkzeug.utils import secure_filename

from CTFd.models import Files, db
from CTFd.utils.uploads import delete_file, upload_file

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "svg"}
MAX_ICON_BYTES = 2 * 1024 * 1024  # 2 MB
FILES_PREFIX = "/files/"


def _validate(file_obj):
    filename = secure_filename(file_obj.filename or "")
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Unsupported image type. Use png, jpg, gif, webp or svg."
        )
    if not (file_obj.mimetype or "").startswith("image/"):
        raise ValueError("Uploaded file is not an image")

    file_obj.seek(0, 2)
    size = file_obj.tell()
    file_obj.seek(0)
    if size > MAX_ICON_BYTES:
        raise ValueError("Image must be smaller than 2 MB")
    return filename


def _stored_location(icon):
    """Devuelve la ruta relativa en uploads si el icono es un archivo subido."""
    if icon and FILES_PREFIX in icon:
        return icon.split(FILES_PREFIX, 1)[1]
    return None


def delete_team_icon(team):
    location = _stored_location(team.icon)
    if location:
        existing = Files.query.filter_by(location=location).first()
        if existing:
            delete_file(existing.id)
    team.icon = None
    db.session.commit()


def save_team_icon(team, file_obj):
    filename = _validate(file_obj)

    # Borrar el archivo anterior para no acumular basura en uploads
    location = _stored_location(team.icon)
    if location:
        existing = Files.query.filter_by(location=location).first()
        if existing:
            delete_file(existing.id)

    file_row = upload_file(
        file=file_obj,
        type="standard",
        location=f"team-{team.id}-icon/{filename}",
    )
    team.icon = url_for("views.files", path=file_row.location)
    db.session.commit()
    return team.icon
